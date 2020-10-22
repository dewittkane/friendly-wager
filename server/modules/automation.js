const cron = require('node-cron');
const { theJudge, getGamesFromNfl } = require('../modules/theJudge');

cron.schedule('0 11 * * 2', function(){
    getGamesFromNfl();
})

cron.schedule('5 11 * * 2', function(){
    theJudge();
})