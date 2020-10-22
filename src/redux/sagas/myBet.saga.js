import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

function* getMyActiveBets(){
    try {
        let response = yield axios.get('/api/bets/my-bets/active');
        yield put({type: 'SAVE_ACTIVE_BETS', payload: response.data})
    }catch(error){
        console.log("ERROR IN GET ACTIVE BETS SAGA: ", error)
    }
}

function* getMyCompletedBets(){
    try{
        let response = yield axios.get('/api/bets/my-bets/history')
        yield put({type: 'SAVE_COMPLETED_BETS', payload: response.data})
    }catch(error){
        console.log("ERROR IN GET COMPLETED BETS SAGA: ", error)
    }
}

function* getMyOpenBets(){
    try{
        let response = yield axios.get('/api/bets/my-bets/open');
        yield put({type: 'SAVE_OPEN_BETS', payload: response.data})
    }catch(error){
        console.log("ERROR IN GET OPEN BETS SAGA: ", error)
    }
}

function* getMyOverallPlusMinus(){
    try{
        let response = yield axios.get('api/bets/my-unit-history');
        yield put({type: 'SAVE_OVERALL_PLUS_MINUS', payload: response.data})
    }catch(error){
        console.log('ERROR IN GET MY OVERALL PLUS/MINUS: ', error)
    }
}

function* myBetSaga(){
    yield takeEvery('GET_MY_ACTIVE_BETS', getMyActiveBets);
    yield takeEvery('GET_MY_COMPLETED_BETS', getMyCompletedBets);
    yield takeEvery('GET_MY_OPEN_BETS', getMyOpenBets);
    yield takeEvery('GET_MY_OVERALL_PLUS_MINUS', getMyOverallPlusMinus)
}

export default myBetSaga;