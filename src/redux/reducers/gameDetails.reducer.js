const gameDetailsReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_GAME_DETAILS':
        return action.payload;
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.gameDetails
  export default gameDetailsReducer;