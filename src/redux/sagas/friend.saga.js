import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

function* getMembers(action){
    try{
        let response = yield axios.get(`/api/friend/${action.payload.search}/${action.payload.type}`);
        yield put({type: 'SAVE_MEMBERS', payload: response.data})
    }catch(error){
        console.log('ERROR IN GET MEMBERS SAGA: ', error);
    }
}

function* getFriends(){
    try{
        let response = yield axios.get(`/api/friend`);
        yield put({type: 'SET_FRIENDS', payload: response.data})
    }catch(error){
        console.log('ERROR IN GET FRIENDS SAGA ', error);
    }
}

function* searchFriends(action){
    try{
        let response = yield axios.get(`/api/friend/${action.payload.search}/${action.payload.type}`);
        console.log(response.data);
        yield put({type: 'SET_FRIENDS', payload: response.data})
    }catch(error){
        console.log('ERROR IN GET SEARCH FRIENDS SAGA: ', error);
    }
}

function* addFriend(action){
    try{
        yield axios.post(`/api/friend`, action.payload);
        yield put({type: "GET_MEMBERS", payload: {search: 'All'}})
    }catch(error){
        console.log('ERROR IN ADD FRIEND SAGA: ', error)
    }
}

// fetches information for friends statistics page
function* getStatistics(action){
    console.log(action.payload)
   try{
       let response = yield axios.get(`/api/friend/profile/statistics/${action.payload}`);
       yield put({type: 'SET_FRIEND_STATISTICS', payload: response.data})
   }catch(error){
       console.log('ERROR IN GET FRIENDS STATS SAGA: ', error);
   }

}


function* friendSaga(){
    yield takeEvery('GET_MEMBERS', getMembers);
    yield takeEvery('GET_FRIENDS', getFriends);
    yield takeEvery('ADD_FRIEND', addFriend);
    yield takeEvery('FETCH_FRIEND_DETAILS', getStatistics);
    yield takeEvery('GET_FRIENDS_SEARCH', searchFriends);

}

export default friendSaga;

