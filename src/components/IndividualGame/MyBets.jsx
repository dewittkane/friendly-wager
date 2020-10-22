import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CreateBetForm from './CreateBetForm';

import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@material-ui/core';

const useStyles = makeStyles({
  createBetForm: {
    textAlign: 'center',
    marginBottom: '3.5em',
  },
});

function MyBets(props) {

  useEffect(() => {
    props.dispatch({ type: 'FETCH_GAME_DETAILS_MY_BETS', payload: props.match.params.id })
  }, [])

  const classes = useStyles();

  return (
      <div>
        <div>
          <h3>Open Bets</h3>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                {props.store.betReducer.openBetReducer.map((bet, i) => {
                  return (
                    <TableRow key={bet.id}>
                      <TableCell align="left">
                        You have {bet.team_name} {bet.proposers_spread}, {bet.wager} units
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <h3>Active Bets</h3>
          <p>Your active bets</p>
          <h3>Create Bet</h3>
        </div>
        <div className={classes.createBetForm}>
          <CreateBetForm />
        </div>
      </div>
  );
}


export default connect(mapStoreToProps)(withRouter(MyBets));