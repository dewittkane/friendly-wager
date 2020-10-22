const express = require('express');
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');
const axios = require('axios');
const pool = require('../modules/pool');
const router = express.Router();
require('dotenv').config();
const { theJudge, getGamesFromNfl } = require('../modules/theJudge');

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
    const result = await getGamesFromNfl();
    console.log('got games happened?', result);
    if (result == true){
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }
    
});

router.put('/theJudge', async (req, res) => {    
    const result = await theJudge();
    console.log('the judge happened?', result);
    if (result = true){
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }
});

module.exports = router;

