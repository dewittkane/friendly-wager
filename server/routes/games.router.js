const express = require('express');
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');
const axios = require('axios');
const pool = require('../modules/pool');
const router = express.Router();
require('dotenv').config();
const convertTeamName = require('../modules/api-functions');
const convertDate = require('../modules/check-week');
const theJudge = require('../modules/theJudge');

//the querytext in this route will need to be changed
//as of now it's not getting the team names or logos, just displaying team id
//need to change date column data type to time, time currently not displaying correctly
router.get('/week/:week', rejectUnauthenticated, (req, res) => {
    const queryText = `SELECT games.*, home_team."name" as home_team, away_team."name" as away_team
                    FROM "games"
                    LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
                    LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
                    WHERE "games".week = $1;`
    pool.query(queryText, [req.params.week])
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('ERROR GETTING GAMES', error);
            res.sendStatus(500); //internal server error
        })
});

//goes to get individual game details
router.get('/details/:id', rejectUnauthenticated, (req, res) => {
    const queryText = `SELECT games.*, home_team."name" as home_team, away_team."name" as away_team, home_team."logo" as home_team_logo, away_team."logo" as away_team_logo
                    FROM "games"
                    LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
                    LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
                    WHERE "games".id = $1;`
    pool.query(queryText, [req.params.id])
        .then((result) => {
            res.send(result.rows[0]);
        })
        .catch((error) => {
            console.log('ERROR GETTING GAME DETAILS', error);
            res.sendStatus(500); //internal server error
        })
});


//How do we protect this route!?!? we move it!
router.get('/fromNflApi', async (req, res) => {
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

        const weekNumber =  await convertDate();
        console.log('week number is', weekNumber);
        
        const params = `s={"$query":{"week.season":2020,"week.seasonType":"REG","week.week":${weekNumber}}}&fs={week{season,seasonType,week},id,gameTime,gameStatus,homeTeam{id,abbr},visitorTeam{id,abbr},homeTeamScore,visitorTeamScore}`
        const url = encodeURI(`${base}${params}`)
        const getGameInfo = {
            method: 'get',
            headers: {
                authorization: `Bearer ${authResponse.data.access_token}`
            },
            url: url
        }
        const gameResponse = await axios(getGameInfo)

        //let nflGame = {homeTeamAbbr: ATL, awayTeamAbbr: CLE, week: 4, gameTime: '2020-10-11T10:00:00.000-07:00'}
        let nflGames = []
        gameResponse.data.data.map(game => {
            let nflGame = {
                nflId: game.id,
                homeTeamAbbr: game.homeTeam.abbr,
                awayTeamAbbr: game.visitorTeam.abbr,
                week: game.week.week,
                gameTime: game.gameTime
            };
            nflGames.push(nflGame);
        })
        console.log(nflGames);
        
        //START OF ODDS API CALL
        const oddsResponse = await axios.get(`https://api.the-odds-api.com/v3/odds/?apiKey=${process.env.ODDS_KEY}&sport=americanfootball_nfl&region=us&mkt=spreads&dateFormat=iso`);
        oddsResponse.data.data.map(game => {
            // console.log(game);
            

            //builds empty newGame object
            let newGame = {};

            //converts team names to three letter codes to match NFL
            newGame.homeTeamId = convertTeamName(game.home_team);

            //determines home teams index (this api is dumb)
            let homeTeamIndex;
            let awayTeamIndex;
            if (game.teams[0] === game.home_team) {
                newGame.awayTeamId = convertTeamName(game.teams[1])
                homeTeamIndex = 0;
                awayTeamIndex = 1;
            } else {
                newGame.awayTeamId = convertTeamName(game.teams[0])
                homeTeamIndex = 1;
                awayTeamIndex = 0;
            }

            //assigns appropriate spread based on index
            newGame.home_team_spread = game.sites[0].odds.spreads.points[homeTeamIndex];
            newGame.away_team_spread = game.sites[0].odds.spreads.points[awayTeamIndex];

            //matchs odds games with nfl games
            nflGames.map(nflGame => {
                if (nflGame.homeTeamAbbr === newGame.homeTeamId) {
                    nflGame.home_team_spread = newGame.home_team_spread;
                    nflGame.away_team_spread = newGame.away_team_spread;
                }
            });
        });
        console.log('NFLGAMES COMPLETE', nflGames);

        await client.query('BEGIN');

        nflGames.map(async game => {
            //checks to make sure that the game has a spread
            if( game.hasOwnProperty('home_team_spread') ){
                console.log('starting item');
                
                //gets database ids for away and home teams
                const idQuery = `SELECT id FROM teams WHERE nfl_api_ref = $1`
                    //adds database id to object for home team
                    const nested_home_team_id = await client.query(idQuery, [game.homeTeamAbbr]);
                    game.home_team_id = nested_home_team_id.rows[0].id;
                    //adds database id to object for away team
                    const nested_away_team_id = await client.query(idQuery, [game.awayTeamAbbr]);
                    game.away_team_id = nested_away_team_id.rows[0].id;

                //posts games to database
                const postQuery = `INSERT INTO games 
                ("nfl_id", "home_team_id", "away_team_id", "home_team_spread", "away_team_spread", "date", "week")
                VALUES ($1, $2, $3, $4, $5, $6, $7)`
                const postValues = [game.nflId, game.home_team_id, game.away_team_id, game.home_team_spread, game.away_team_spread, game.gameTime, game.week];
                await client.query(postQuery, postValues);
                console.log('finishing item');

            }
        })
        // console.log(nflGames);
        
        await client.query('COMMIT');
        res.sendStatus(201);

    } catch (error) {
        await client.query('ROLLBACK');
        console.log('ERROR NFL ROUTER', error);
        res.sendStatus(500)
    } finally {
        client.release();
    }
});

router.put('/theJudge', async (req, res) => {    
    const result = await theJudge();
    console.log('the judge happened?', result);
    res.sendStatus(200);
});

module.exports = router;

