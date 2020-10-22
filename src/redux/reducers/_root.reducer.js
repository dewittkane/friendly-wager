import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import memberReducer from './member.reducer'
import games from './games.reducer';
import nav from './nav.reducer';
import gameDetails from './gameDetails.reducer';
import friendsList from './friends.reducer'
import friendStatistics from './friendStatistics.reducer'
import betReducer from './bet.reducer'

// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user, // will have an id and username if someone is logged in
  memberReducer,
  games,
  friendsList,
  nav,
  gameDetails,
  friendStatistics,
  betReducer,
});

export default rootReducer;
