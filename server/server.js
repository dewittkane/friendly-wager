
const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/user.strategy');


//api automation file
const automationFunction = require('./modules/automation');

// Route includes
const userRouter = require('./routes/user.router');
const friendRouter = require('./routes/friend.router');
const gamesRouter = require('./routes/games.router');
const betsRouter = require('./routes/bets.router');



// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/friend', friendRouter);
app.use('/api/games', gamesRouter);
app.use('/api/bets', betsRouter);



// Serve static files
app.use(express.static('build'));

//cron automation
automationFunction();

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
