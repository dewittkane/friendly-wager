const goBackReducer = (state = false, action) => {
    switch (action.type) {
      case 'SET_BACK_STATUS':
        return action.payload;
      default:
        return state;
    }
  };
  
  export default goBackReducer;
