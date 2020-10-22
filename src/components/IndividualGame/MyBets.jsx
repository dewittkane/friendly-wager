import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import React from 'react';
import { withRouter } from 'react-router-dom';
import CreateBetForm from './CreateBetForm';

import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles({
  createBetForm: {
    textAlign: 'center',
    marginBottom: '3.5em',
  },
});

function MyBets(props) {

  const classes = useStyles();

  return (
    <div>
      <div>
        <h3>Open Bets</h3>
        {props.store.betReducer.openBetReducer[0] ?
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                {/* only shows your open bets for this particular game */}
                {props.store.betReducer.openBetReducer.filter(bet => 
                  (bet.proposers_id === props.store.user.id && bet.game_id === props.store.gameDetails.id)).map(bet => 
                    (<TableRow key={bet.id}>
                      <TableCell align="left">
                        {/* determines if proposer has home team stats */}
                        {bet.proposers_team_is_home_team ? 
                          <Typography> You have {bet.home_team_name} {bet.home_team_spread} for {bet.wager} units.</Typography> 
                          :
                          <Typography> You have {bet.away_team_name} {bet.away_team_spread} for {bet.wager} units.</Typography>
                        }
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" size="small" color="secondary" >Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          :
          <Typography>You don't have any open bets for this game.</Typography>
        }
        <h3>Active Bets</h3>
        {props.store.betReducer.activeBetReducer[0] ?
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>
                {/* filters only active bets for this game */}
                {props.store.betReducer.activeBetReducer.filter(bet => 
                  (bet.game_id === props.store.gameDetails.id)).map(bet => (
                    <TableRow key={bet.id}>
                        {bet.proposers_id === props.store.user.id ?
                          bet.proposers_team_is_home_team ? 
                            //user is proposer and team is home
                            <TableCell align="left">
                              You have {bet.home_team_name} {bet.home_team_spread} for {bet.wager}, {bet.acceptors_first_name} {bet.acceptors_last_name} has taken {bet.away_team_name}.
                            </TableCell>
                            :
                            //user is proposer and team is away
                            <TableCell align="left">
                              You have {bet.away_team_name} {bet.away_team_spread} for {bet.wager}, {bet.acceptors_first_name} {bet.acceptors_last_name} has taken {bet.home_team_name}.
                            </TableCell>
                          :
                          bet.proposers_team_is_home_team ?
                            //user is acceptor and team is away
                            <TableCell align="left">
                              You have {bet.away_team_name} {bet.away_team_spread} for {bet.wager}, {bet.proposers_first_name} {bet.proposers_last_name} has taken {bet.home_team_name}.
                            </TableCell>
                            :
                            //user is acceptor and team is home
                            <TableCell align="left">
                              You have {bet.home_team_name} {bet.home_team_spread} for {bet.wager}, {bet.proposers_first_name} {bet.proposers_last_name} has taken {bet.away_team_name}.
                            </TableCell>
                        }                      
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          :
          <Typography>You don't have any active bets for this game.</Typography>
        }
        <h3>Create Bet</h3>
      </div>
      <div className={classes.createBetForm}>
        <CreateBetForm />
      </div>
    </div>
  );
}


export default connect(mapStoreToProps)(withRouter(MyBets));