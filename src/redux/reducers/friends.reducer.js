const friendsList = (state = [], action) => {
    switch (action.type) {
        case 'SET_FRIENDS':
            return action.payload;
        case 'UNSET_FRIENDS':
            return [];
        default:
            return state;
    }
}

export default friendsList;