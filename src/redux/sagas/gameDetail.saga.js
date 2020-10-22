import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchGameDetails(action) {
  try {
    let response = yield axios.get(`/api/games/details/${action.payload}`);
    //sending game details to reducer
    yield put({ type: 'SET_GAME_DETAILS', payload: response.data })

  } catch (error) {
    console.log('ERROR FETCHING GAME DETAILS', error);
  }
}

function* gamesSaga() {
  yield takeLatest('FETCH_GAME_DETAILS', fetchGameDetails);
}

export default gamesSaga;
