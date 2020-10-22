import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

function* getMembers(action){
    try{
        let response = yield axios.get(`/api/friend/${action.payload.search}`);
        yield put({type: 'SAVE_MEMBERS', payload: response.data})
    }catch(error){
        console.log('ERROR IN GET MEMBERS SAGA: ', error);
    }
}


function* friendSaga(){
    yield takeEvery('GET_MEMBERS', getMembers)
}

export default friendSaga;

