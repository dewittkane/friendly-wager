import React from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles, Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles({
  tableContainer: {
    marginTop: '2.5em',
  }, 
  conditionalText: {
    marginTop: '3em',
  }
});

function Active(props) {

  const classes = useStyles();

  return (
    <>
      {props.store.betReducer.activeBetReducer[0]
        ?
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Date</TableCell>
                <TableCell align="center">Game</TableCell>
                <TableCell align="left">Against</TableCell>
                <TableCell align="left">My Bet</TableCell>
                <TableCell align="left">Wager</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.store.betReducer.activeBetReducer.map(bet => (
                <TableRow key={bet.id}>
                  <TableCell align="left">{moment(bet.date).format("M/D")}</TableCell>
                  <TableCell align="left">{bet.away_team_abbr} @ {bet.home_team_abbr}</TableCell>
                  {bet.proposers_id === props.store.user.id ?
                    bet.proposers_team_is_home_team ?
                      //user is proposer and team is home
                      <>
                        <TableCell align="left">{bet.acceptors_first_name} {bet.acceptors_last_name}</TableCell>
                        <TableCell align="left">{bet.home_team_name} {bet.home_team_spread > 0 && '+'}{bet.home_team_spread}</TableCell>
                      </>
                      :
                      //user is proposer and team is away
                      <>
                        <TableCell align="left">{bet.acceptors_first_name} {bet.acceptors_last_name}</TableCell>
                        <TableCell align="left">{bet.away_team_name} {bet.away_team_spread > 0 && '+'}{bet.away_team_spread}</TableCell>
                      </>
                    :
                    bet.proposers_team_is_home_team ?
                      //user is acceptor and team is away
                      <>
                        <TableCell align="left">{bet.proposers_first_name} {bet.proposers_last_name}</TableCell>
                        <TableCell align="left">{bet.away_team_name} {bet.away_team_spread > 0 && '+'}{bet.away_team_spread}</TableCell>
                      </>
                      :
                      //user is acceptor and team is home
                      <>
                        <TableCell align="left">{bet.proposers_first_name} {bet.proposers_last_name}</TableCell>
                        <TableCell align="left">{bet.home_team_name} {bet.home_team_spread > 0 && '+'}{bet.home_team_spread}</TableCell>
                      </>
                  }
                  <TableCell align="left">{bet.wager}</TableCell>
                </TableRow>
              )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        :
        <Typography color="textPrimary" className={classes.conditionalText}>You don't have any active bets yet.</Typography>
      }
    </>
  );
}

export default connect(mapStoreToProps)(Active);
