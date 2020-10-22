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
            "games".over_under,
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
            AND "bets".accepted = false
            ORDER BY "games".date ASC;`

    pool.query(queryText, [req.user.id])
        .then(response => {
            res.send(response.rows);
        })
        .catch(error => {
            res.sendStatus(500);
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
                "games".over_under,
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
                AND "bets".completed = false
                ORDER BY "games".date ASC;`

    pool.query(queryText, [req.user.id])
        .then(response => {
            res.send(response.rows);
        })
        .catch(error => {
            res.sendStatus(500);
        })

});

//5.3 your completed bet history
router.get('/my-bets/history', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id;
    const betQuery = `SELECT  "bets".*, 
                "home_team".nfl_api_ref AS home_team_abbr, 
                "away_team".nfl_api_ref AS away_team_abbr,
                "home_team".name AS home_team_name,
                "away_team".name AS away_team_name, 
                "proposer".first_name AS proposers_first_name,
                "proposer".last_name AS proposers_last_name,
                "acceptor".first_name AS acceptors_first_name,
                "acceptor".last_name AS acceptors_last_name,
                "games".over_under,
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
                AND "bets".completed = true
                ORDER BY "games".date DESC;`

    pool.query(betQuery, [userId])
        .then(response => {
            res.send(response.rows)
        }).catch(error => {
            res.sendStatus(500)
        })
        
});

//3.2 creating bet, posting bet to bets table
router.post('/', rejectUnauthenticated, (req, res) => {
    const { proposers_id, wager, game_id, proposers_team_id, proposers_bet_is_over } = req.body;

    if ( proposers_team_id ) {
        let queryText = `INSERT INTO "bets" ("proposers_id", "wager", "game_id", "proposers_team_id")
                            VALUES ($1, $2, $3, $4);`
        pool.query(queryText, [proposers_id, wager, game_id, proposers_team_id])
        .then(() => {
            res.sendStatus(201); //created status
        })
        .catch((error) => {
            res.sendStatus(500);
        })
    } else {
        let queryText = `INSERT INTO "bets" ("proposers_id", "wager", "game_id", "proposers_bet_is_over")
                            VALUES ($1, $2, $3, $4);`
        pool.query(queryText, [proposers_id, wager, game_id, proposers_bet_is_over])
        .then(() => {
            res.sendStatus(201); //created status
        })
        .catch((error) => {
            res.sendStatus(500);
        })
    }
    

});

//2.1/3.1 accepting bets
router.put('/accept', rejectUnauthenticated, (req, res) => {
    const { bet_id, acceptors_team_id } = req.body;
    const acceptors_id = req.user.id

    if (req.body.bet_is_over_under) {
        const queryText = `UPDATE "bets" SET "accepted" = true, "acceptors_id" = $1 WHERE "bets".id = $2;`
        
        pool.query(queryText, [acceptors_id, bet_id])
            .then(() => {
                res.sendStatus(200);
            })
            .catch((error) => {
                res.sendStatus(500);
            })
    } else {
        const queryText = `UPDATE "bets" SET "accepted" = true, "acceptors_id" = $1, acceptors_team_id = $2 WHERE "bets".id = $3;`
        
        pool.query(queryText, [acceptors_id, acceptors_team_id, bet_id])
            .then(() => {
                res.sendStatus(200);
            })
            .catch((error) => {
                res.sendStatus(500);
            })
    }
});

//3.2 and 5.2 deleting bets
router.delete('/delete/:id', rejectUnauthenticated, (req, res) => {
    const { id } = req.params;
    const queryText = `DELETE FROM "bets" WHERE "bets".id = $1;`
    
    pool.query(queryText, [id])
        .then(() => {
            res.sendStatus(202); //accepted status
        })
        .catch((error) => {
            res.sendStatus(500);
        })
});

module.exports = router;