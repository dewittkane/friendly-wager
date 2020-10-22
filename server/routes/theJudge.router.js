const express = require('express');
const axios = require('axios');
const pool = require('../modules/pool');
const router = express.Router();
const convertDate = require('../modules/check-week');


// //NFL API QUERY
// week is current week -1 (always last week)
// //MATCH NFL GAME IDS -duhhhhhhhhhhhh, need to add this to games
// Promise.all Games.map(
//     for each one ;
//     //This code is real and works
//     //update game scores
//     `UPDATE games SET home_team_score = $1, away_team_score = $2, game_completed = true, winning_team_id = (SELECT 
//         CASE
//             WHEN ($1 + home_team_spread > $2)
//             THEN home_team_id
//             WHEN ($1 + home_team_spread < $2)
//             THEN away_team_id
//         END FROM games WHERE id = $3)
//          WHERE id = $3;`
// )

// //update bets with winners based on scores
// //draws will have winner id 0
// `UPDATE bets 
//     SET winners_id = CASE 
//     	WHEN bets.proposers_team_id = games.winning_team_id 
//     		THEN proposers_id
//     	WHEN bets.acceptors_team_id = games.winning_team_id 
//             THEN acceptors_id
//     	END
//     FROM games WHERE bets.game_id = games.id AND games.week = 5;`

//     //delete all unaccepted bets every week
// `DELETE FROM bets WHERE accepted = false;`