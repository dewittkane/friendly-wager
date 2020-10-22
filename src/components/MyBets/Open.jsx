import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

// Basic functional component structure for React with default state
// value setup. When making a new component be sure to replace the
// component name Open with the name for the new component.
function Open(props) {
 
  useEffect( () => {
    props.dispatch({type: 'GET_MY_OPEN_BETS'})
  }, [])

  return (
    <div>

    </div>
  );
}

export default connect(mapStoreToProps)(Open);
