import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

//sending bet to router
function* postBet(action) {
  try {
    yield axios.post('/api/bets', action.payload);
    yield fetchGameDetailsMyBets({ payload: action.payload.game_id });
  } catch (error) {
    console.log('ERROR POSTING BET', error);
  }
};

//accepting bet
function* acceptBet(action) {
  try {
    yield axios.put('/api/bets/accept', action.payload);
    //this tells us if we were viewing an individual game, or all open bets, when we accepted and will refresh appropriately
    if ( action.payload.is_individual_game ) {
      yield fetchGameOpenBets({ payload: action.payload.game_id })
    } else {
      yield fetchAllOpenBets();
    }
    
  } catch (error) {
    console.log('ERROR ACCEPTING BET', error);
  }
};

//this is for 3.2 my bets, open bets
function* fetchGameDetailsMyBets(action) {
    try {
        let response = yield axios.get(`/api/bets/details/my-bets/open/${action.payload}`);
        yield put({type: 'SAVE_OPEN_BETS', payload: response.data});
      } catch (error) {
        console.log('ERROR GETTING GAME DETAILS MY BETS OPEN BETS', error);
      }
};

//requesting 3.1 bets
function* fetchGameOpenBets(action) {
  try {
    const response = yield axios.get(`/api/bets/details/open/${action.payload}`);

    yield put({type: 'SAVE_OPEN_BETS', payload: response.data})

  } catch (error) {
    console.log('ERROR FETCHING INDIVIDUAL GAME OPEN BETS', error);
  }
}

//requesting 2.1 bets
function* fetchAllOpenBets() {
  try {
    const response = yield axios.get(`/api/bets/open`);

    yield put({type: 'SAVE_OPEN_BETS', payload: response.data})

  } catch (error) {
    console.log('ERROR FETCHING ALL OPEN BETS', error);
  }
}

function* betsSaga() {
  yield takeLatest('POST_BET', postBet);
  yield takeLatest('ACCEPT_BET', acceptBet);
  yield takeLatest('FETCH_GAME_DETAILS_MY_BETS', fetchGameDetailsMyBets)
  yield takeLatest('FETCH_GAME_OPEN_BETS', fetchGameOpenBets);
  yield takeLatest('FETCH_ALL_OPEN_BETS', fetchAllOpenBets);
};

export default betsSaga;
