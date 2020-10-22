const friendStatistics = (state = [], action) => {
    switch (action.type) {
        case 'SET_FRIEND_STATISTICS':
            return action.payload;
        case 'UNSET_FRIEND_STATISTICS':
            return [];
        default:
            return state;
    }
}

export default friendStatistics;