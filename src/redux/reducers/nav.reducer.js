let initialState = true;

const navReducer = (state= initialState, action)=>{
    switch(action.type){
      case 'TOGGLE_NAV': 
        return !state;
      case 'RESET_NAV':
          return true;
      default:
        return state;
    }

  }


// user will be on the redux state at:
// state.user
export default navReducer;
