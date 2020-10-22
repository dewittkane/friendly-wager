import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

//sending bet to router
function* postBet(action) {
  try {
    yield axios.post('/api/bets', action.payload);
    yield fetchBets();

  } catch (error) {
    console.log('ERROR POSTING BET', error);
  }
};

//accepting bet
function* acceptBet(action) {
    console.log('SAGA ACCEPT BET', action.payload);
    try {
      yield axios.put('/api/bets/accept', action.payload);
      yield fetchBets();
      
    } catch (error) {
      console.log('ERROR ACCEPTING BET', error);
    }
  };

//requests all bets
function* fetchBets(){
  try {
    //gets open and saves to reducer
    const openBets = yield axios.get(`/api/bets/open`);
    yield put({type: 'SAVE_OPEN_BETS', payload: openBets.data});

    //gets active and saves to reducer
    const activeBets = yield axios.get(`/api/bets/active`);
    yield put({type: 'SAVE_ACTIVE_BETS', payload: activeBets.data});

  } catch (error) {
    console.log('ERROR FETCHING ALL BETS', error);
  }
}

function* fetchBetHistory(){
  try{
      let response = yield axios.get('/api/bets/my-bets/history')
      yield put({type: 'SAVE_COMPLETED_BETS', payload: response.data})
  }catch(error){
      console.log("ERROR FETCHING BET HISTORY ", error)
  }
}

function* betsSaga() {
  yield takeLatest('FETCH_BETS', fetchBets);
  yield takeLatest('POST_BET', postBet);
  yield takeLatest('ACCEPT_BET', acceptBet);
  yield takeLatest('FETCH_BET_HISTORY', fetchBetHistory);

};

export default betsSaga;
