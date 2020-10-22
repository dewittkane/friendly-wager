const cron = require('node-cron');
const { getGamesFromNfl, updateOdds, closeBets, updateNflScores, theJudge } = require('../modules/theJudge');

//holds all the cron automation
function automationFunction(){
    
    //gets the current week games
    //scheduled to run once at 1am Tuesday
    cron.schedule('0 1 * * 2', function(){
        getGamesFromNfl();
    });
    
    //gets NFL scores for the previous week
    //scheduled to run once at 1:05am Tuesday
    //this also judicates outstanding bets
    cron.schedule('5 1 * * 2', function(){
        updateNflScores();
    });

    //gets the current nfl odds
    //scheduled to run at 2am, 8am, and 4pm on Tuesdays
    cron.schedule('0 2,8,16 * * 2', function(){
        updateOdds();
    });

    //deletes unaccepted bets if game has started
    //scheduled to run every 15 minutes between 10am and 9pm Monday, Tuesday, Thursday, and Sunday
    cron.schedule('0,15,30,45 10-18 * * 1,2,4,7', function(){
        closeBets();
    });

    //runs the judge to ensure bets have been adjudicated
    //scheduled to run once at 1:10am Tuesday
    cron.schedule('10 1 * * 2', function(){
        theJudge();
    });

};

module.exports = automationFunction
