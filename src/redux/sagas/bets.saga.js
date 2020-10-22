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

//requesting 3.1 bets
function* fetchGameOpenBets(action) {
  try {
    const response = yield axios.get(`/api/bets/details/open/${action.payload}`);

    yield put({type: 'SAVE_OPEN_BETS', payload: response.data})

  } catch (error) {
    console.log('ERROR FETCHING INDIVIDUAL GAME OPEN BETS', error);
  }
}

function* betsSaga() {
  yield takeLatest('POST_BET', postBet);
  yield takeLatest('FETCH_GAME_OPEN_BETS', fetchGameOpenBets);
}

export default betsSaga;
