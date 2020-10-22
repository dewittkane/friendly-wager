import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

//sending bet to router
function* postBet(action) {
  try {
    yield axios.post('/api/bets', action.payload);

  } catch (error) {
    console.log('ERROR POSTING BET', error);
  }
}

function* betsSaga() {
  yield takeLatest('POST_BET', postBet);
}

export default betsSaga;
