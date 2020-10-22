const memberReducer = (state = [], action) => {
    switch (action.type) {
        case 'SAVE_MEMBERS':
            return action.payload;
        default:
            return state;
    }
}

export default memberReducer;