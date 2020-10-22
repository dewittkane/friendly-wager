const express = require('express');
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
require('dotenv').config();

router.get('/week/:week', rejectUnauthenticated, (req, res) => {
    const queryText = `SELECT games.*, home_team."name" as home_team, away_team."name" as away_team, home_team."nfl_api_ref" as home_team_abbr, away_team."nfl_api_ref" as away_team_abbr, home_team."logo" as home_team_logo, away_team."logo" as away_team_logo
                    FROM "games"
                    LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
                    LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
                    WHERE "games".week = $1 AND home_team_spread IS NOT NULL AND over_under IS NOT NULL
                    ORDER BY "date" ASC;`
    pool.query(queryText, [req.params.week])
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('ERROR GETTING GAMES', error);
            res.sendStatus(500); //internal server error
        })
});

module.exports = router;

