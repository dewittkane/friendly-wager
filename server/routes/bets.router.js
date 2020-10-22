const express = require('express');
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

//2.1 all of your friends open bets
router.get('/open', rejectUnauthenticated, async (req, res) => {
    const client = await pool.connect();

    try {
        //gets all of the logged in user's friends
        const friendQuery = `SELECT "user".id FROM "user"
        JOIN "friends" ON "friends".user2_id = "user".id
        WHERE "friends".user1_id = $1
        UNION
        SELECT "user".id FROM "user"
        JOIN "friends" ON "friends".user1_id = "user".id
        WHERE "friends".user2_id = $1;`

        const friendResults = await pool.query(friendQuery, [req.user.id])
        const friendsIds = friendResults.rows;

        //gets all of their friends open bets
        const bets = await Promise.all(friendsIds.map(friendsId => {
            const betQuery = `SELECT * FROM "bets"
                WHERE "proposers_id" = $1
                AND "accepted" = false;`

            return client.query(betQuery, [friendsId, req.params.id])
        }))
        
        await client.query('COMMIT');
        res.send(bets)

    } catch (error) {
        await client.query('ROLLBACK');
        console.log('ERROR GETTING 3.1 BETS', error);
        res.sendStatus(500)
    } finally {
        client.release();
    }
});

//3.1 open bets on individual game
router.get('/details/open/:id', rejectUnauthenticated, async (req, res) => {
    const client = await pool.connect();

    try {
        //gets all of the logged in user's friends
        const friendQuery = `SELECT "user".id FROM "user"
        JOIN "friends" ON "friends".user2_id = "user".id
        WHERE "friends".user1_id = $1
        UNION
        SELECT "user".id FROM "user"
        JOIN "friends" ON "friends".user1_id = "user".id
        WHERE "friends".user2_id = $1;`

        const friendResults = await pool.query(friendQuery, [req.user.id])
        const friendsIds = friendResults.rows;

        //gets all of their friends open bets for this particular game
        const bets = await Promise.all(friendsIds.map(friendsId => {
            const betQuery = `SELECT * FROM "bets"
                WHERE "proposers_id" = $1
                AND "accepted" = false
                AND "game_id" = $2;`

            return client.query(betQuery, [friendsId, req.params.id])
        }))
        
        await client.query('COMMIT');
        res.send(bets)

    } catch (error) {
        await client.query('ROLLBACK');
        console.log('ERROR GETTING 3.1 BETS', error);
        res.sendStatus(500)
    } finally {
        client.release();
    }
});

//3.2 your open bets on individual game
router.get('/details/my-bets/open/:id', rejectUnauthenticated, (req, res) => {
    const userId = req.user.id;
    const gameId = req.params.id;
    const betQuery = `SELECT * FROM "bets"
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
    const betQuery = `SELECT * FROM "bets"
                WHERE ("proposers_id" = $1 OR "acceptors_id" = $1)
                AND "accepted" = true
                AND "completed" = false;`

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
    const betQuery = `SELECT * FROM "bets"
                WHERE "proposers_id" = $1
                AND "accepted" = false;`

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
    const betQuery = `SELECT * FROM "bets"
                WHERE ("proposers_id" = $1 OR "acceptors_id" = $1)
                AND "completed" = true;`

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
            res.send(response.rows)
        }).catch(error => {
            console.log('error getting your lifetime +/-', error); 
            res.sendStatus(500)
        })
        
});

//3.2 creating bet, posting bet to bets table
router.post('/', rejectUnauthenticated, (req, res) => {
    console.log('ROUTER BET', req.body);
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

module.exports = router;