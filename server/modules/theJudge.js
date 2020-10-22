const pool = require('../modules/pool');
const axios = require('axios')
const convertDate = require('./check-week');

//updates the NFL scores with data from the API
const updateNflScores = async (req, res) => {
    const client = await pool.connect();

    try {
        //does post request to get access token
        const authParams = {
            grant_type: "client_credentials",
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        }
        const getAccessToken = {
            method: 'post',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: Object.entries(authParams).map(e => e.join('=')).join('&'),
            url: 'https://api.nfl.com/v1/oauth/token'
        }
        const authResponse = await axios(getAccessToken);
        const base = 'https://api.nfl.com/v1/games?';

        //gets the previous NFL week number
        const lastWeekNumber = await (convertDate()) - 1;
        console.log('Pulling games for last week', lastWeekNumber);

        //builds query using access token
        const params = `s={"$query":{"week.season":2020,"week.seasonType":"REG","week.week":${lastWeekNumber}}}&fs={week{season,seasonType,week},id,gameTime,gameStatus,homeTeam{id,abbr},visitorTeam{id,abbr},homeTeamScore,visitorTeamScore}`
        const url = encodeURI(`${base}${params}`)
        const getGameInfo = {
            method: 'get',
            headers: {
                authorization: `Bearer ${authResponse.data.access_token}`
            },
            url: url
        }

        //stores games with scores
        const gameResponse = await axios(getGameInfo)
        const completedNflGames = gameResponse.data.data

        //updates games in database
        await client.query('BEGIN');

        completedNflGames.map(async game => {
            //if game is finalized
            if (game.gameStatus.phase == "FINAL" || "FINAL/OT") {
                //adds scores to games, referencing nfl_id
                //applies spread to point value to see who wins bets
                const queryText = `UPDATE games SET home_team_score = $1, away_team_score = $2, game_completed = true, bet_winning_team_id = (SELECT 
                    CASE
                        WHEN ($1::integer + home_team_spread > $2::integer)
                        THEN home_team_id
                        WHEN ($1::integer + home_team_spread < $2::integer)
                        THEN away_team_id
                    END FROM games WHERE nfl_id = $3)
                    WHERE nfl_id = $3;`

                const gameUpdateValues = [game.homeTeamScore.pointsTotal, game.visitorTeamScore.pointsTotal, game.id];

                client.query(queryText, gameUpdateValues);
            } //end if statement
        });

        //adjudicates the bets
        await theJudge();

        //signing off
        await client.query('COMMIT');
        return true

    } catch (error) {
        await client.query('ROLLBACK');
        console.log('ERROR UPDATING NFL SCORES', error);
        //didn't work, whomp whomp
        return false;
    } finally {
        client.release();
    }
};

//adjudicates bets
const theJudge = () => {
        pool.query(`UPDATE bets 
                SET winners_id = CASE 
                    WHEN bets.proposers_team_id = games.bet_winning_team_id 
                        THEN proposers_id
                    WHEN bets.acceptors_team_id = games.bet_winning_team_id 
                        THEN acceptors_id
                    WHEN bets.proposers_bet_is_over = true AND ((games.home_team_score + games.away_team_score) > games.over_under)
                    THEN proposers_id
                    WHEN bets.proposers_bet_is_over = false AND ((games.home_team_score + games.away_team_score) > games.over_under)
                        THEN acceptors_id
                    WHEN bets.proposers_bet_is_over = true AND ((games.home_team_score + games.away_team_score) < games.over_under)
                        THEN acceptors_id
                    WHEN bets.proposers_bet_is_over = false AND ((games.home_team_score + games.away_team_score) < games.over_under)
                        THEN proposers_id
                    END, completed = true
                FROM games WHERE accepted = true AND bets.game_id = games.id AND bets.completed = false AND games.game_completed = true;`)
};

//deletes all unaccepted open bets from games that have already started 
const closeBets = () => {
    try{
        const timestamp = new Date()
        console.log(`The time and date is ${timestamp}.  Deleting all open bets for games that have already started.`);
        
        pool.query(`DELETE FROM "bets" USING "games" WHERE "bets".game_id = "games".id AND "accepted" = false AND "games".date <= $1;`, [timestamp]);
        return true;
    } catch (error) {
        console.log('error deleting old bets', error);
        return false;
    }
};

//gets games from the NFL api
const getGamesFromNfl = async (req, res) => {
    const client = await pool.connect();

    try {
        //does post request to get access token
        const authParams = {
            grant_type: "client_credentials",
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        }
        const getAccessToken = {
            method: 'post',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: Object.entries(authParams).map(e => e.join('=')).join('&'),
            url: 'https://api.nfl.com/v1/oauth/token'
        }
        const authResponse = await axios(getAccessToken);
        const base = 'https://api.nfl.com/v1/games?';

        //gets current nfl week number
        const weekNumber = await convertDate();

        //builds query using access token
        const params = `s={"$query":{"week.season":2020,"week.seasonType":"REG","week.week":${weekNumber}}}&fs={week{season,seasonType,week},id,gameTime,gameStatus,homeTeam{id,abbr},visitorTeam{id,abbr},homeTeamScore,visitorTeamScore}`
        const url = encodeURI(`${base}${params}`)
        const getGameInfo = {
            method: 'get',
            headers: {
                authorization: `Bearer ${authResponse.data.access_token}`
            },
            url: url
        }

        //stores games
        const gameResponse = await axios(getGameInfo)
        let nflGames = gameResponse.data.data

        //posts games to database
        await client.query('BEGIN');

        nflGames.map(async game => {
                const postQuery = ` INSERT INTO games 
                    ("nfl_id", "home_team_id", "away_team_id", "date", "week")
                    VALUES 
                        ($1, 
                        (SELECT id FROM "teams" WHERE "nfl_api_ref" = $2), 
                        (SELECT id FROM "teams" WHERE "nfl_api_ref" = $3), 
                        $4, 
                        $5) 
                    ON CONFLICT ("nfl_id") DO NOTHING;`
                const postValues = [game.id, game.homeTeam.abbr, game.visitorTeam.abbr, game.gameTime, game.week.week];
                await client.query(postQuery, postValues);
                console.log(`Added game ${game.visitorTeam.abbr} @ ${game.homeTeam.abbr}.`);
        })

        //commits all inserts if no errors
        await client.query('COMMIT');
        return true;

    } catch (error) {
        await client.query('ROLLBACK');
        console.log('ERROR NFL ROUTER', error);
        return false
    } finally {
        client.release();
    }
};

//updates the games in the DB with the most recent odds
const updateOdds = async (req, res) => {
    try {
    //this query gets the available spread for the upcoming NFL games
    const oddsResponse = await axios.get(`https://api.the-odds-api.com/v3/odds/?apiKey=${process.env.ODDS_KEY}&sport=americanfootball_nfl&region=us&mkt=spreads&dateFormat=iso`);
    const gamesWithSpread = oddsResponse.data.data
    
    //gets the current NFL week
    const currentWeek = await convertDate()

    await gamesWithSpread.map(game => {
        //sql parses the api's dumb index based spread
        //matches game on home team, away team and week number
        //will not update if game already has odds
        let queryText = `
            UPDATE "games" 
            SET 
            home_team_spread =
                CASE 
                    WHEN (SELECT id FROM teams WHERE $1 = "odds_api_ref") = "games".home_team_id 
                        THEN $3::numeric
                    ELSE $4::numeric
                END,
            away_team_spread =
                CASE 
                    WHEN (SELECT id FROM teams WHERE $1 = "odds_api_ref") = "games".away_team_id 
                        THEN $3::numeric
                    ELSE $4::numeric
                END
            WHERE ((((SELECT id FROM teams WHERE $1 = "odds_api_ref") = "games".home_team_id) AND ((SELECT id FROM teams WHERE $2 = "odds_api_ref") = "games".away_team_id))
            OR  (((SELECT id FROM teams WHERE $2 = "odds_api_ref") = "games".home_team_id) AND ((SELECT id FROM teams WHERE $1 = "odds_api_ref") = "games".away_team_id)))
            AND games.week = $5 AND games.home_team_spread IS NULL AND games.away_team_spread IS NULL;
            `
        let queryValues = [game.teams[0], game.teams[1], Number(game.sites[0].odds.spreads.points[0]), Number(game.sites[0].odds.spreads.points[1]), currentWeek]
        pool.query(queryText, queryValues)
        });

        //this api query gets over unders for the games
        const oddsTotalsResponse = await axios.get(`https://api.the-odds-api.com/v3/odds/?apiKey=${process.env.ODDS_KEY}&sport=americanfootball_nfl&region=us&mkt=totals&dateFormat=iso`);
        const gamesWithTotals = oddsTotalsResponse.data.data

        await gamesWithTotals.map(game => {
            //matches game on home team, away team and week number
            //will not update if game already has o/u
            let queryText = `
                UPDATE "games" 
                SET 
                over_under = $3
                WHERE ((((SELECT id FROM teams WHERE $1 = "odds_api_ref") = "games".home_team_id) AND ((SELECT id FROM teams WHERE $2 = "odds_api_ref") = "games".away_team_id))
                OR  (((SELECT id FROM teams WHERE $2 = "odds_api_ref") = "games".home_team_id) AND ((SELECT id FROM teams WHERE $1 = "odds_api_ref") = "games".away_team_id)))
                AND games.week = $4 AND games.over_under IS NULL;
                `
            let queryValues = [game.teams[0], game.teams[1], Number(game.sites[0].odds.totals.points[0]), currentWeek]
            pool.query(queryText, queryValues)
            });
            
        return true;
    } catch (error) {
        console.log('error getting odds', error);
        return false;
    }
};


module.exports = { getGamesFromNfl, updateOdds, closeBets, updateNflScores };