const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const convertTeamName = require('../modules/api-functions');

router.get('/', async (req, res) => {
    try {
        const authParams = {
            grant_type: "client_credentials",
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        }
        const options = {
            method: 'post',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            data: Object.entries(authParams).map(e => e.join('=')).join('&'),
            url: 'https://api.nfl.com/v1/oauth/token'
        }
        const authResponse = await axios(options);
        // console.log('ROUTER', authResponse);
        //   const authJSON = await authResponse.json();
        const base = 'https://api.nfl.com/v1/games?';
        const weekNumber = 4;
        const params = `s={"$query":{"week.season":2020,"week.seasonType":"REG","week.week":${weekNumber}}}&fs={week{season,seasonType,week},id,gameTime,gameStatus,homeTeam{id,abbr},visitorTeam{id,abbr},homeTeamScore,visitorTeamScore}`
        const url = encodeURI(`${base}${params}`)
        const gameOptions = {
            method: 'get',
            headers: {
                authorization: `Bearer ${authResponse.data.access_token}`
            },
            url: url
        }
        const gameResponse = await axios(gameOptions)
        // console.log('ROUTER GAME RESPONSE', gameResponse);
        // console.log('ROUTER GAME RESPONSE DATA', gameResponse.data.data[1]);

        //let nflGame = {homeTeamAbbr: ATL, awayTeamAbbr: CLE, week: 4, gameTime: '2020-10-11T10:00:00.000-07:00'}
        let nflGames = []
        gameResponse.data.data.map(game => {
            let nflGame = {
                homeTeamAbbr: game.homeTeam.abbr,
                awayTeamAbbr: game.visitorTeam.abbr,
                week: game.week.week,
                gameTime: game.gameTime
            };
            nflGames.push(nflGame);
        })
        // console.log(nflGames);

        //START OF ODDS API CALL
        const oddsResponse = await axios.get(`https://api.the-odds-api.com/v3/odds/?apiKey=${process.env.ODDS_KEY}&sport=americanfootball_nfl&region=us&mkt=spreads&dateFormat=iso`)
        // console.log(oddsResponse.data.data[7].sites[2]);
        // let testTeam = convertTeamName('Atlanta Falcons');
        // console.log(testTeam);
        // let newGame = {homeTeamId: 1, awayTeamId: 2, isHomeTeamFavored: true, favoredSpread: -3}
        oddsResponse.data.data.map(game => {
            // console.log(game);
            let newGame = {};
            newGame.homeTeamId = convertTeamName(game.home_team);
            let homeTeamIndex = 0;
            let awayTeamIndex = 1;
            if (game.teams[0] === game.home_team) {
                newGame.awayTeamId = convertTeamName(game.teams[1])
            } else {
                newGame.awayTeamId = convertTeamName(game.teams[0])
                homeTeamIndex = 1;
                awayTeamIndex = 0;
            }
            if (game.sites[2].odds.spreads.points[homeTeamIndex] < 0) {
                newGame.isHomeTeamFavored = true;
                newGame.favoredSpread = game.sites[2].odds.spreads.points[homeTeamIndex];
            } else if (game.sites[2].odds.spreads.points[homeTeamIndex] > 0) {
                newGame.isHomeTeamFavored = false;
                newGame.favoredSpread = game.sites[2].odds.spreads.points[awayTeamIndex];
            }
            nflGames.map(nflGame => {
                if (nflGame.homeTeamAbbr === newGame.homeTeamId) {
                    nflGame.isHomeTeamFavored = newGame.isHomeTeamFavored;
                    nflGame.favoredSpread = newGame.favoredSpread;
                }
            });
        });
        console.log('NFLGAMES COMPLETE', nflGames);
        //   const gameJSON = await gameResponse.json();
        //   gameJSON.data.map(function(game) { 
        //     if (game.visitorTeamScore.pointsTotal > game.homeTeamScore.pointsTotal) { 
        //       return game.visitorTeam.abbr;
        //     } 
        //     else { 
        //       return game.homeTeam.abbr; 
        //     }  
        //   })
    } catch (error) {
        console.log('ERROR NFL ROUTER', error);
    }
});

// router.get('/oddsapi', async (req, res) => {
//     try {
//         const oddsResponse = await axios.get(`https://api.the-odds-api.com/v3/odds/?apiKey=${process.env.ODDS_KEY}&sport=americanfootball_nfl&region=us&mkt=spreads&dateFormat=iso`)
//         // console.log(oddsResponse.data.data[7].sites[2]);
//         // let testTeam = convertTeamName('Atlanta Falcons');
//         // console.log(testTeam);
//         // let newGame = {homeTeamId: 1, awayTeamId: 2, isHomeTeamFavored: true, favoredSpread: -3}
//         oddsResponse.data.data.map(game => {
//             // console.log(game);
//             let newGame = {};
//             newGame.homeTeamId = convertTeamName(game.home_team);
//             let homeTeamIndex = 0;
//             let awayTeamIndex = 1;
//             if (game.teams[0] === game.home_team) {
//                 newGame.awayTeamId = convertTeamName(game.teams[1])
//             } else {
//                 newGame.awayTeamId = convertTeamName(game.teams[0])
//                 homeTeamIndex = 1;
//                 awayTeamIndex = 0;
//             }
//             if (game.sites[2].odds.spreads.points[homeTeamIndex] < 0) {
//                 newGame.isHomeTeamFavored = true;
//                 newGame.favoredSpread = game.sites[2].odds.spreads.points[homeTeamIndex];
//             } else if (game.sites[2].odds.spreads.points[homeTeamIndex] > 0) {
//                 newGame.isHomeTeamFavored = false;
//                 newGame.favoredSpread = game.sites[2].odds.spreads.points[awayTeamIndex];
//             }
//             console.log(newGame);
//         });
//     } catch (error) {
//         console.log('ERROR ODDS ROUTER', error);
//     }
// });

module.exports = router;