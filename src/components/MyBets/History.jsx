import React from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles, Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles({
  table: {
    flexGrow: 1
  },
  tableContainer: {
    marginTop: '2.5em',
  },
  conditionalText: {
    marginTop: '3em',
  }
});

function History(props) {

  const classes = useStyles();

  return (
    <>
      {props.store.betReducer.completedBetReducer.length
        ?
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Date</TableCell>
                <TableCell align="center">Game</TableCell>
                <TableCell align="left">Against</TableCell>
                <TableCell align="left">My Bet</TableCell>
                <TableCell align="left">W/L</TableCell>
                <TableCell align="left">Wager</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.store.betReducer.completedBetReducer.map(bet => (
                <TableRow key={bet.id}>
                  <TableCell align="left">{moment(bet.date).format("M/D")}</TableCell>
                  <TableCell align="left">{bet.home_team_name} @ {bet.away_team_name}</TableCell>
                  <TableCell align="left">{bet.opponent}</TableCell>
                  <TableCell align="left">{bet.my_bet_team} {bet.my_spread > 0 && '+'}{bet.my_spread}</TableCell>
                  <TableCell align="left">{bet.winner}</TableCell>
                  <TableCell align="left">{bet.wager}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        :
        <Typography color="textPrimary" className={classes.conditionalText}>You haven't completed any bets yet.</Typography>
      }
    </>
  );
}

export default connect(mapStoreToProps)(History);
