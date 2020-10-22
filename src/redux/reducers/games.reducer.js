const gamesReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_GAMES':
        return action.payload;
      default:
        return state;
    }
  };
  
  export default gamesReducer;

  
  