import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchGames(action) {
  try {
    let response = yield axios.get(`/api/games/week/${action.payload}`);
    console.log(response.data);
    //sending games to reducer
    yield put({ type: 'SET_GAMES', payload: response.data })
  } catch (error) {
    console.log('ERROR FETCHING GAMES', error);
  }
}

function* gamesSaga() {
  yield takeLatest('FETCH_GAMES', fetchGames);
}

export default gamesSaga;
