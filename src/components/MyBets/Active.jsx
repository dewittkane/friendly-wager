import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

// Basic functional component structure for React with default state
// value setup. When making a new component be sure to replace the
// component name Active with the name for the new component.
function Active(props) {
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  // const [heading, setHeading] = useState('Functional Component');

  useEffect( () => {
    props.dispatch({type: 'GET_MY_ACTIVE_BETS'})
  }, [])

  return (
    <div>
      
    </div>
  );
}

export default connect(mapStoreToProps)(Active);
