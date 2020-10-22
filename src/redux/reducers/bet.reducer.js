import { combineReducers } from 'redux';

const activeBetReducer = (state = [], action) => {
    switch (action.type) {
        case 'SAVE_ACTIVE_BETS':
            return action.payload;
        case 'LOGOUT':
            return [];
        default:
            return state;
    }
}

const completedBetReducer = (state = [], action) => {
    switch(action.type) {
        case 'SAVE_COMPLETED_BETS':
            return action.payload;
        case 'LOGOUT':
            return [];
        default:
            return state;
    }
}

const openBetReducer = (state = [], action) => {
    switch(action.type){
        case 'SAVE_OPEN_BETS':
            return action.payload;
        case 'LOGOUT':
            return [];
        default:
            return state;
    }
}

const betReducer = combineReducers({
    activeBetReducer,
    completedBetReducer,
    openBetReducer,
})

export default betReducer;