const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');

  // route to get all of app users
router.get('/:search', rejectUnauthenticated, (req, res) => {
    if(req.params.search ==='All') {
        let queryText = `SELECT id, username, first_name, last_name FROM "user";`;
    pool.query(queryText)
    .then(result => {
        res.send(result.rows)
    })
    .catch(error => {
        res.sendStatus(500)
    })
    } else{
        let name = `%${req.params.search}%`;
        let queryText = `SELECT id, username, first_name, last_name FROM "user"
        WHERE "first_name" ILIKE $1;`;
        pool.query(queryText, [name])
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            res.sendStatus(500);
        })
    }
})

router.get('/', rejectUnauthenticated, (req, res) => {
    let queryText = `
    SELECT "user".id, "user".username, "user".first_name, "user".last_name FROM "user"
    JOIN "friends" ON "user".id = "friends".user2_id OR "user".id = "friends".user1_id
    WHERE "friends".user1_id = $1 OR "friends".user2_id = $1;
  `;
    pool.query(queryText, [req.user.id])
    .then(result => {
        let newFriendsList = [];
        console.log(result.rows)
        for(let i = 0; i < result.rows.length; i++){
            if(result.rows[i].id !== req.user.id){
                newFriendsList.push(result.rows[i])
            }
        }
        res.send(newFriendsList)
        
    })
    .catch(error => {
        res.sendStatus(500)
    })
})


module.exports = router;