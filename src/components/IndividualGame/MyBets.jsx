import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import React from 'react';
import { withRouter } from 'react-router-dom';
import CreateBetForm from './CreateBetForm';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles({
  createBetForm: {
    textAlign: 'center',
    marginBottom: '3.5em',
  },
  text: {
    marginTop: '1em',
    marginBottom: '1em',
  },
  creatBet: {
    marginBottom: '1em',
  },
});

function MyBets(props) {

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //deleting bet
  const handleDelete = (id) => {
    console.log('deleting bet:', id);
    props.dispatch({ type: 'DELETE_BET', payload: id });
    handleClose();
  }

  return (
    <div>
      <div>
        <Typography variant="h5" color="textPrimary">Open Bets</Typography>
        {props.store.betReducer.openBetReducer.filter(bet =>
                  (bet.proposers_id === props.store.user.id && bet.game_id === props.store.gameDetails.id)).length
          ?
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
                        <DeleteForeverIcon color="secondary" onClick={handleClickOpen} />
                      </TableCell>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">{`Delete open bet?`}</DialogTitle>
                        <DialogActions>
                          <Button onClick={handleClose} color="primary">
                            Cancel
                          </Button>
                          <Button onClick={() => handleDelete(bet.id)} color="primary" autoFocus>
                            Yes
                        </Button>
                        </DialogActions>
                      </Dialog>
                    </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
          :
          <Typography color="textPrimary" className={classes.text}>You don't have any open bets for this game.</Typography>
        }
        <Typography variant="h5" color="textPrimary">Active Bets</Typography>
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
          <Typography color="textPrimary" className={classes.text}>You don't have any active bets for this game.</Typography>
        }
        <Typography variant="h5" color="textPrimary" className={classes.text}>Create Bet</Typography>
      </div>
      <div className={classes.createBetForm}>
        <CreateBetForm />
      </div>
    </div>
  );
}

export default connect(mapStoreToProps)(withRouter(MyBets));