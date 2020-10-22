import React from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import {Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper} from '@material-ui/core'
import moment from 'moment';

function Open(props) {

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Date</TableCell>
            <TableCell align="center">Game</TableCell>
            <TableCell align="left">My Bet</TableCell>
            <TableCell align="left">Wager</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.store.betReducer.openBetReducer.map(bet => (
            <TableRow key={bet.id}>
              <TableCell align="left">{moment(bet.date).format("M/D")}</TableCell> 
              <TableCell align="left">{bet.away_team_name} @ {bet.home_team_name}</TableCell>
              <TableCell align="left">{bet.my_bet_team} {bet.proposers_spread}</TableCell>
              <TableCell align="left">{bet.wager}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default connect(mapStoreToProps)(Open);
