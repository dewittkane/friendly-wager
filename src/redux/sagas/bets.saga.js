import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

//sending bet to router
function* postBet(action) {
        yield axios.post('/api/bets', action.payload);
        yield fetchBets();
};

//accepting bet
function* acceptBet(action) {
        yield axios.put('/api/bets/accept', action.payload);
        yield fetchBets();
};

//deleting bet
function* deleteBet(action) {
        yield axios.delete(`/api/bets/delete/${action.payload}`);
        yield fetchBets();
};

//requests all bets
function* fetchBets() {
    try {
        //gets open and saves to reducer
        const openBets = yield axios.get(`/api/bets/open`);
        yield put({ type: 'SAVE_OPEN_BETS', payload: openBets.data });

        //gets active and saves to reducer
        const activeBets = yield axios.get(`/api/bets/active`);
        yield put({ type: 'SAVE_ACTIVE_BETS', payload: activeBets.data });

        //gets completed and saves to reducer
        let response = yield axios.get('/api/bets/my-bets/history')
        yield put({ type: 'SAVE_COMPLETED_BETS', payload: response.data });

    } catch (error) {
        console.log('ERROR FETCHING ALL BETS', error);
    }
}


function* betsSaga() {
    yield takeLatest('FETCH_BETS', fetchBets);
    yield takeLatest('POST_BET', postBet);
    yield takeLatest('ACCEPT_BET', acceptBet);
    yield takeLatest('DELETE_BET', deleteBet);
};

export default betsSaga;
