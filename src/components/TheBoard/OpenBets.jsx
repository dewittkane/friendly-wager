import React, { useState } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

// Basic functional component structure for React with default state
// value setup. When making a new component be sure to replace the
// component name OpenBets with the name for the new component.
function OpenBets(props) {
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const [heading, setHeading] = useState('Functional Component');

  return (
    <div>
      <h2>All Open bets go here</h2>
    </div>
  );
}

export default connect(mapStoreToProps)(OpenBets);
