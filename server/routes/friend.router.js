const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');

  // 4.1 route to get all of app users
router.get('/:search/:type', rejectUnauthenticated, async (req, res) => {
    let nonFriendMembersList = [];
    let friendSearchList = [];
    const client = await pool.connect();
    try{
        await client.query('BEGIN');
        const firstQuery = `SELECT "user".id FROM "user"
        JOIN "friends" ON "friends".user2_id = "user".id
        WHERE "friends".user1_id = $1
        UNION
        SELECT "user".id FROM "user"
        JOIN "friends" ON "friends".user1_id = "user".id
        WHERE "friends".user2_id = $1;`;
        let friends =  await client.query(firstQuery, [req.user.id]);
        let secondQuery = `SELECT id, username, first_name, last_name, image_url FROM "user"
        WHERE ("first_name" ILIKE '%' || $1 || '%'
        OR "last_name" ILIKE '%' || $1 || '%')
        AND "id" != $2
        ORDER BY "first_name" ASC`;
        let members = await client.query(secondQuery, [req.params.search, req.user.id]);
        console.log(members.rows)
        await client.query('COMMIT');
        nonFriendMembersList = members.rows.filter( (memberObj) => {
            return !friends.rows.find( (friendObj) => {
                return memberObj.id === friendObj.id
            })
        })
        friendSearchList = members.rows.filter( (memberObj) => {
            return friends.rows.find( (friendObj) => {
                return memberObj.id === friendObj.id
            })
        })
        if(req.params.type === 'friend'){
        res.send(friendSearchList);
        }
        else {
        res.send(nonFriendMembersList)
        }   
    }catch(error){
        await client.query('ROLLBACK');
        throw error;
    }finally{
        client.release()
    }
})

// 4.2 route to get the current logged in user's friends
router.get('/', rejectUnauthenticated, (req, res) => {
        let queryText = `
        SELECT "user".id, "user".username, "user".first_name, "user".last_name, "user".image_url FROM "user"
        JOIN "friends" ON "friends".user2_id = "user".id
        WHERE "friends".user1_id = $1
        UNION
        SELECT "user".id, "user".username, "user".first_name, "user".last_name, "user".image_url FROM "user"
        JOIN "friends" ON "friends".user1_id = "user".id
        WHERE "friends".user2_id = $1
        ORDER BY first_name ASC;
      `;
    pool.query(queryText, [req.user.id])
    .then(result => {
        res.send(result.rows) 

    })
    .catch(error => {
        res.sendStatus(500)
    })
})

// 4.2 route to add a friend
router.post('/', rejectUnauthenticated, (req, res) => {
    let queryText = `INSERT INTO "friends" (user1_id, user2_id)
    VALUES ($1, $2);`;
    pool.query(queryText, [req.user.id, req.body.friendId])
    .then(result => {
        res.sendStatus(201)
    })
    .catch(error =>{
        res.sendStatus(500);
    })
})

// 4.3 route to get individual friend statistics
router.get('/profile/statistics/:id', rejectUnauthenticated, (req, res) => {
    let queryText = `SELECT id FROM "bets"
    WHERE proposers_id = $1 OR acceptors_id = $1`
    console.log('req id', req.params.id);
    
    pool.query(queryText, [req.params.id])
    .then(result => {
        res.send(result.rows)
    })
    .catch(error => {
        res.sendStatus(500)
    })
})

module.exports = router;