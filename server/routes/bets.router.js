const express = require('express');
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

//all open bets
router.get('/open', rejectUnauthenticated, (req, res) => {

    const queryText = `SELECT  "bets".*, 
            "home_team".nfl_api_ref AS home_team_abbr, 
            "away_team".nfl_api_ref AS away_team_abbr,
            "home_team".name AS home_team_name,
            "away_team".name AS away_team_name, 
            "user".first_name AS proposers_first_name,
            "user".last_name AS proposers_last_name,
            "games".home_team_spread,
            "games".away_team_spread,
            "games".home_team_id,
            "games".away_team_id,
            "games".date,
            CASE
            	WHEN "bets".proposers_team_id = "games".home_team_id
            		THEN true
            		ELSE false
            END AS "proposers_team_is_home_team",
            CASE
                WHEN "bets".proposers_team_id = "games".home_team_id
                    THEN "games".away_team_id
                    ELSE "games".home_team_id
            END AS "acceptors_team_id"
            FROM "bets"
            JOIN "games" ON "games".id = "bets".game_id
            LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
            LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
            LEFT JOIN "user" ON "bets".proposers_id = "user".id
            WHERE "bets".proposers_id IN (
                SELECT "user".id FROM "user"
		            JOIN "friends" ON "friends".user2_id = "user".id
		            WHERE "friends".user1_id = $1
		        UNION
		        SELECT "user".id FROM "user"
		            JOIN "friends" ON "friends".user1_id = "user".id
                    WHERE "friends".user2_id = $1
                UNION
                SELECT "user".id FROM "user"
                    WHERE "user".id = $1)
            AND "bets".accepted = false;`

    pool.query(queryText, [req.user.id])
        .then(response => {
            console.log(response.rows);
            res.send(response.rows);
        })
        .catch(error => {
            console.log('error in fetching open bets', error);
        })

});

//all active bets
router.get('/active', rejectUnauthenticated, (req, res) => {

    const queryText = `SELECT  "bets".*, 
                "home_team".nfl_api_ref AS home_team_abbr, 
                "away_team".nfl_api_ref AS away_team_abbr,
                "home_team".name AS home_team_name,
                "away_team".name AS away_team_name, 
                "proposer".first_name AS proposers_first_name,
                "proposer".last_name AS proposers_last_name,
                "acceptor".first_name AS acceptors_first_name,
                "acceptor".last_name AS acceptors_last_name,
                "games".home_team_spread,
                "games".away_team_spread,
                "games".home_team_id,
                "games".away_team_id,
                "games".date,
                CASE
                    WHEN "bets".proposers_team_id = "games".home_team_id
                        THEN true
                        ELSE false
                END AS "proposers_team_is_home_team"
                FROM "bets"
                JOIN "games" ON "games".id = "bets".game_id
                LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
                LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
                LEFT JOIN "user" as proposer ON "bets".proposers_id = "proposer".id
                LEFT JOIN "user" as acceptor ON "bets".acceptors_id = "acceptor".id
                WHERE ("bets".proposers_id = $1 OR "bets".acceptors_id = $1)
                AND "bets".accepted = true
                AND "bets".completed = false;`

    pool.query(queryText, [req.user.id])
        .then(response => {
            console.log(response.rows);
            res.send(response.rows);
        })
        .catch(error => {
            console.log('error in fetching all active bets', error);
        })

});

//5.3 your completed bet history
router.get('/my-bets/history', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id;
    const betQuery = `SELECT "bets".id, "bets".wager, "bets".game_id, "user".first_name AS opponent, "games".date, "home_team".nfl_api_ref AS home_team_name, 
    "away_team".nfl_api_ref AS away_team_name, "my_bet_team".nfl_api_ref AS my_bet_team,
    CASE 
    WHEN "bets".proposers_team_id = "games".home_team_id THEN "games".home_team_spread
    ELSE "games".away_team_spread
    END AS my_spread,
    CASE
    WHEN "bets".winners_id = $1 THEN 'W'
    ELSE 'L'
    END AS winner
    FROM "bets"
    JOIN "user" ON "user".id = "bets".acceptors_id
    JOIN "games" ON "games".id = "bets".game_id
    LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
    LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
    LEFT JOIN "teams" as my_bet_team ON "bets".proposers_team_id = "my_bet_team".id
    WHERE "bets".proposers_id = $1
    AND "bets".completed = true
    UNION
    SELECT "bets".id, "bets".wager, "bets".game_id, "user".first_name AS opponent, "games".date, "home_team".nfl_api_ref AS home_team_name, 
    "away_team".nfl_api_ref AS away_team_name, "my_bet_team".nfl_api_ref AS my_bet_team,
    CASE 
    WHEN "bets".acceptors_team_id = "games".home_team_id THEN "games".home_team_spread
    ELSE "games".away_team_spread
    END AS my_spread,
    CASE
    WHEN "bets".winners_id = $1 THEN 'W'
    ELSE 'L'
    END AS winner
    FROM "bets"
    JOIN "user" ON "user".id = "bets".proposers_id
    JOIN "games" ON "games".id = "bets".game_id
    LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
    LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
    LEFT JOIN "teams" as my_bet_team ON "bets".acceptors_team_id = "my_bet_team".id
    WHERE "bets".acceptors_id = $1
    AND "bets".completed = true;`

    pool.query(betQuery, [userId])
        .then(response => {
            res.send(response.rows)
        }).catch(error => {
            console.log('error getting your bet history', error); 
            res.sendStatus(500)
        })
        
});

//5.0 your lifetime +/-
router.get('/my-unit-history', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id;
    const betQuery = `SELECT SUM("wager" *  
                                CASE "winners_id" 
                                    WHEN $1 THEN 1
                                    ELSE -1
                                END) 
                        FROM "bets"
                        WHERE ("proposers_id" = $1 OR "acceptors_id" = $1)
                        AND "completed" = true
                        AND "winners_id" IS NOT NULL;`

    pool.query(betQuery, [userId])
        .then(response => {
            res.send(response.rows[0])
        }).catch(error => {
            console.log('error getting your lifetime +/-', error); 
            res.sendStatus(500)
        })
        
});

//3.2 creating bet, posting bet to bets table
router.post('/', rejectUnauthenticated, (req, res) => {
    const { proposers_id, wager, game_id, proposers_team_id } = req.body;
    const queryText = `INSERT INTO "bets" ("proposers_id", "wager", "game_id", "proposers_team_id")
                        VALUES ($1, $2, $3, $4);`
    
    pool.query(queryText, [proposers_id, wager, game_id, proposers_team_id])
        .then(() => {
            console.log('BET CREATED')
            res.sendStatus(201); //created status
        })
        .catch((error) => {
            console.log('ERROR CREATING BET', error);
        })
});

//2.1/3.1 accepting bets
router.put('/accept', rejectUnauthenticated, (req, res) => {
    const { bet_id, acceptors_team_id } = req.body;
    const acceptors_id = req.user.id
    const queryText = `UPDATE "bets" SET "accepted" = true, "acceptors_id" = $1, acceptors_team_id = $2 WHERE "bets".id = $3;`
    
    pool.query(queryText, [acceptors_id, acceptors_team_id, bet_id])
        .then(() => {
            console.log('BET ACCEPTED')
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('ERROR ACCEPTING BET', error);
        })
});

module.exports = router;