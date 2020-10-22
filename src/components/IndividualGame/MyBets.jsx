import React, { useState } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import CreateBetForm from './CreateBetForm';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  createBetForm: {
    textAlign: 'center',
  },
});

function MyBets(props) {

  const classes = useStyles();
  const [heading, setHeading] = useState('Functional Component');

  return (
    <div>
      <div>
        <h2>Open Bets</h2>
        <p>Your open bets</p>
        <h2>Active Bets</h2>
        <p>Your active bets</p>
        <h2>Create Bet</h2>
      </div>
      <div className={classes.createBetForm}>
        <CreateBetForm />
      </div>
    </div>
  );
}

export default connect(mapStoreToProps)(MyBets);
