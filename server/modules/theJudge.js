const pool = require('../modules/pool');
const axios = require('axios')
const convertDate = require('./check-week');

const theJudge = async (req, res) => {
    const client = await pool.connect();

    try {
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

        //gets current week
        const weekNumber =  await convertDate();
        console.log('pulling games for last week', weekNumber - 1);
        
        const params = `s={"$query":{"week.season":2020,"week.seasonType":"REG","week.week":${weekNumber - 1}}}&fs={week{season,seasonType,week},id,gameTime,gameStatus,homeTeam{id,abbr},visitorTeam{id,abbr},homeTeamScore,visitorTeamScore}`
        const url = encodeURI(`${base}${params}`)
        const getGameInfo = {
            method: 'get',
            headers: {
                authorization: `Bearer ${authResponse.data.access_token}`
            },
            url: url
        }
        const gameResponse = await axios(getGameInfo)

        const completedGamesArray = gameResponse.data.data
        console.log(completedGamesArray);
        
        await client.query('BEGIN');

        await Promise.all(completedGamesArray.map(game => {
                
                //updates scores in database
                const scoreUpdateQuery = `UPDATE games 
                    SET home_team_score = $1, away_team_score = $2, game_completed = true
                    WHERE nfl_id = $3;`
                const scoreUpdateValues = [game.homeTeamScore.pointsTotal, game.visitorTeamScore.pointsTotal, game.id];
                
                client.query(scoreUpdateQuery, scoreUpdateValues);

                //updates winners in database
                const winnerUpdateQuery = `UPDATE games 
                    SET 
                    bet_winning_team_id = (SELECT 
                        CASE
                            WHEN (home_team_score + home_team_spread > away_team_score)
                            THEN home_team_id
                            WHEN (home_team_score + home_team_spread < away_team_score)
                            THEN away_team_id
                        END FROM games WHERE nfl_id = $1)
                    WHERE nfl_id = $1;`
                const winnerUpdateValues = [game.id];
                
                client.query(winnerUpdateQuery, winnerUpdateValues);
            }
        ))
        
        //adjudicates bets
        const adjudicationQuery = `UPDATE bets 
                SET winners_id = CASE 
                    WHEN bets.proposers_team_id = games.bet_winning_team_id 
                        THEN proposers_id
                    WHEN bets.acceptors_team_id = games.bet_winning_team_id 
                        THEN acceptors_id
                    END, completed = true
                FROM games WHERE bets.game_id = games.id AND games.week = $1;`
        const adjudicationWeekValue = [weekNumber - 1];
        console.log(weekNumber);
        
        await client.query(adjudicationQuery, adjudicationWeekValue)
        
        //delete unaccepted bets
        await client.query(`DELETE FROM bets WHERE accepted = false;`)
        
        await client.query('COMMIT');

        //signing off
        return true

        

    } catch (error) {
        await client.query('ROLLBACK');
        console.log('ERROR NFL ROUTER', error);

        //didn't work, whomp whomp
        return false;
    } finally {
        console.log('Released!!!');
        client.release();

    }
}

module.exports = theJudge;