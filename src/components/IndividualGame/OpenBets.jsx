import React, { useState } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import moment from 'moment';
import OpenBetRow from './OpenBetRow';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
});

function OpenBets(props) {

  const classes = useStyles();

  return (
          <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Friend</TableCell>
            <TableCell align="right">Game</TableCell>
            <TableCell align="right">Bet</TableCell>
            <TableCell align="right">Wager</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {props.store.betReducer.openBetReducer.map((bet, i) => {
            return (
              <OpenBetRow key={bet.id} bet={bet} />
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default connect(mapStoreToProps)(OpenBets);
