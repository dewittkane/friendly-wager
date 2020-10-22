const express = require('express');
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

//2.1 all of your friends open bets
router.get('/open', rejectUnauthenticated, (req, res) => {

    const queryText = `SELECT  "bets".id, 
            "bets".wager, 
            "bets".game_id, 
            "home_team".nfl_api_ref AS home_team_abbr, 
            "away_team".nfl_api_ref AS away_team_abbr, 
            "friends_team".name AS friends_team,
            "user".first_name AS friend_first_name,
            "user".last_name AS friend_last_name,
            CASE 
                WHEN "bets".proposers_team_id = "games".home_team_id 
                    THEN "games".home_team_spread
                    ELSE "games".away_team_spread
            END AS "friends_team_spread",
            CASE
            	WHEN "bets".proposers_team_id = "games".home_team_id
            		THEN "games".away_team_id
            		ELSE "games".home_team_id
            END AS "acceptors_team_id"
            FROM "bets"
            JOIN "games" ON "games".id = "bets".game_id
            LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
            LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
            LEFT JOIN "teams" as friends_team ON "bets".proposers_team_id = "friends_team".id
            LEFT JOIN "user" ON "bets".proposers_id = "user".id
            WHERE "bets".proposers_id IN (SELECT "user".id FROM "user"
		        JOIN "friends" ON "friends".user2_id = "user".id
		        WHERE "friends".user1_id = $1
		        UNION
		        SELECT "user".id FROM "user"
		        JOIN "friends" ON "friends".user1_id = "user".id
		        WHERE "friends".user2_id = $1)
            AND "bets".accepted = false`

    pool.query(queryText, [req.user.id])
        .then(response => {
            console.log(response.rows);
            res.send(response.rows);
        })
        .catch(error => {
            console.log('error in 2.1', error);
        })

});

//3.1 open bets on individual game
router.get('/details/open/:id', rejectUnauthenticated, (req, res) => {
    const queryText = `SELECT  "bets".id, 
            "bets".wager, 
            "bets".game_id, 
            "home_team".nfl_api_ref AS home_team_abbr, 
            "away_team".nfl_api_ref AS away_team_abbr, 
            "friends_team".name AS friends_team,
            "user".first_name AS friend_first_name,
            "user".last_name AS friend_last_name,
            CASE 
                WHEN "bets".proposers_team_id = "games".home_team_id 
                    THEN "games".home_team_spread
                    ELSE "games".away_team_spread
            END AS "friends_team_spread",
            CASE
            	WHEN "bets".proposers_team_id = "games".home_team_id
            		THEN "games".away_team_id
            		ELSE "games".home_team_id
            END AS "acceptors_team_id"
            FROM "bets"
            JOIN "games" ON "games".id = "bets".game_id
            LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
            LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
            LEFT JOIN "teams" as friends_team ON "bets".proposers_team_id = "friends_team".id
            LEFT JOIN "user" ON "bets".proposers_id = "user".id
            WHERE "bets".proposers_id IN (SELECT "user".id FROM "user"
		        JOIN "friends" ON "friends".user2_id = "user".id
		        WHERE "friends".user1_id = $1
		        UNION
		        SELECT "user".id FROM "user"
		        JOIN "friends" ON "friends".user1_id = "user".id
		        WHERE "friends".user2_id = $1)
            AND "bets".accepted = false
            AND "games".id = $2`

    pool.query(queryText, [req.user.id, req.params.id])
        .then(response => {
            console.log(response.rows);
            res.send(response.rows);
        })
        .catch(error => {
            console.log('error in 3.1', error);
        })
});

//3.2 your open bets on individual game
router.get('/details/my-bets/open/:id', rejectUnauthenticated, (req, res) => {
    console.log('ROUTER', req.params.id);
    const userId = req.user.id;
    const gameId = req.params.id;
    const betQuery = `SELECT "teams".name AS team_name, "bets".wager, "bets".id,
                    CASE 
                    WHEN "bets".proposers_team_id = "games".home_team_id THEN "games".home_team_spread
                    ELSE "games".away_team_spread
                    END AS proposers_spread
                    FROM "bets"
                    LEFT JOIN "teams" ON "bets".proposers_team_id = "teams".id
                    LEFT JOIN "games" ON "bets".game_id = "games".id
                    WHERE "proposers_id" = $1
                    AND "accepted" = false
                    AND "game_id" = $2;`

    pool.query(betQuery, [userId, gameId])
        .then(response => {
            res.send(response.rows)
        }).catch(error => {
            console.log('error getting your individual game open bets', error); 
            res.sendStatus(500)
        })
        
});

//3.2 your active bets on individual game
router.get('/details/my-bets/active/:id', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id;
    const gameId = req.params.id;
    const betQuery = `SELECT * FROM "bets"
                WHERE ("proposers_id" = $1 OR "acceptors_id" = $1)
                AND "accepted" = true
                AND "game_id" = $2
                AND "completed" = false;`


    pool.query(betQuery, [userId, gameId])
        .then(response => {
            res.send(response.rows)
        }).catch(error => {
            console.log('error getting your individual game active bets', error); 
            res.sendStatus(500)
        })
        
});

//5.1 your active bets
router.get('/my-bets/active', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id;
    const betQuery = `SELECT "bets".id, "bets".wager, "bets".game_id, "user".first_name AS opponent, "games".date, "home_team".nfl_api_ref AS home_team_name, 
    "away_team".nfl_api_ref AS away_team_name, "my_bet_team".nfl_api_ref AS my_bet_team,
    CASE 
    WHEN "bets".proposers_team_id = "games".home_team_id THEN "games".home_team_spread
    ELSE "games".away_team_spread
    END AS my_spread
    FROM "bets"
    JOIN "user" ON "user".id = "bets".acceptors_id
    JOIN "games" ON "games".id = "bets".game_id
    LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
    LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
    LEFT JOIN "teams" as my_bet_team ON "bets".proposers_team_id = "my_bet_team".id
    WHERE "bets".proposers_id = $1
    AND "bets".accepted = true
    AND "bets".completed = false
    UNION
    SELECT "bets".id, "bets".wager, "bets".game_id, "user".first_name AS opponent, "games".date, "home_team".nfl_api_ref AS home_team_name, 
    "away_team".nfl_api_ref AS away_team_name, "my_bet_team".nfl_api_ref AS my_bet_team,
    CASE 
    WHEN "bets".acceptors_team_id = "games".home_team_id THEN "games".home_team_spread
    ELSE "games".away_team_spread
    END AS my_spread
    FROM "bets"
    JOIN "user" ON "user".id = "bets".proposers_id
    JOIN "games" ON "games".id = "bets".game_id
    LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
    LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
    LEFT JOIN "teams" as my_bet_team ON "bets".acceptors_team_id = "my_bet_team".id
    WHERE "bets".acceptors_id = $1
    AND "bets".accepted = true
    AND "bets".completed = false;`

    pool.query(betQuery, [userId])
        .then(response => {
            res.send(response.rows)
        }).catch(error => {
            console.log('error getting your active bets', error); 
            res.sendStatus(500)
        })
        
});

//5.2 your open bets
router.get('/my-bets/open', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id;
    const betQuery = `SELECT "bets".id, "bets".wager, "bets".game_id, "games".date, "home_team".nfl_api_ref AS home_team_name, 
    "away_team".nfl_api_ref AS away_team_name, "my_bet_team".nfl_api_ref AS my_bet_team,
    CASE 
    WHEN "bets".proposers_team_id = "games".home_team_id THEN "games".home_team_spread
    ELSE "games".away_team_spread
    END AS proposers_spread
    FROM "bets"
    JOIN "games" ON "games".id = "bets".game_id
    LEFT JOIN "teams" as home_team ON "games".home_team_id = "home_team".id
    LEFT JOIN "teams" as away_team ON "games".away_team_id = "away_team".id
    LEFT JOIN "teams" as my_bet_team ON "bets".proposers_team_id = "my_bet_team".id
    WHERE "bets".proposers_id = $1
    AND "bets".accepted = false;`

    pool.query(betQuery, [userId])
        .then(response => {
            res.send(response.rows)
        }).catch(error => {
            console.log('error getting your open bets', error); 
            res.sendStatus(500)
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