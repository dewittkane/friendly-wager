import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import { Typography } from '@material-ui/core';
import { Button, TableCell, TableRow, Paper } from '@material-ui/core';

const StyledTableRow = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.action.hover,
    height: 5

  },
  rowHover: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "rgba(87, 197, 111, 0.13) !important"
    }
  }
}))(TableRow);

const useStyles = makeStyles({
  table: {
    width: 600,
    height: 50
  },
});

function OpenBetRow(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function acceptBet() {
    //sends this payload if spread bet
    if (props.bet.proposers_team_id) {
      props.dispatch({
        type: 'ACCEPT_BET',
        payload:
        {
          bet_id: props.bet.id,
          acceptors_team_id: props.bet.acceptors_team_id
        }
      }) 
    } else {
      //or sends this payload if over/under
      props.dispatch({
        type: 'ACCEPT_BET',
        payload:
          {
            bet_id: props.bet.id,
            bet_is_over_under: true
          }
      })
    }
    //regardless, closes the dialog
    handleClose();
  }

  return (
    <>
      <TableRow hover classes={{ hover: classes.rowHover }} onClick={handleClickOpen}>
        {/* Friend */}
        <TableCell style={{color: 'white'}} align="left">{props.bet.proposers_first_name} {props.bet.proposers_last_name}</TableCell>
        {/* Game */}
        <TableCell style={{color: 'white'}} align="left">{props.bet.away_team_abbr} @ {props.bet.home_team_abbr}</TableCell>
        {/* Bet */}
        {/* determines if bet is spread or O/U */}
        {props.bet.proposers_team_id ? 
          <TableCell align="left" style={{color: 'white'}}>
            {/* checks if proposer is home team */}
            {props.bet.proposers_team_is_home_team ?
              <Typography variant="body2">{props.bet.home_team_name} <br/>{props.bet.home_team_spread > 0 && '+'}{props.bet.home_team_spread}</Typography>
              :
              <Typography variant="body2">{props.bet.away_team_name} <br/>{props.bet.away_team_spread > 0 && '+'}{props.bet.away_team_spread}</Typography>
            }
          </TableCell>
        :
          <TableCell align="left" style={{color: 'white'}}>
            {/* determines if proposer has over */}
            {props.bet.proposers_bet_is_over ?
              <Typography variant="body2">Over <br/>{props.bet.over_under}</Typography>
              :
              <Typography variant="body2">Under <br/>{props.bet.over_under}</Typography>
            } 
          </TableCell>
      }
        {/* Wager */}
        <TableCell style={{color: 'white'}} align="center">{props.bet.wager}u</TableCell>
      </TableRow>
      <>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`Take this Bet?`}</DialogTitle>
          <DialogContent>
            {/* displays different confirmation text depending if the bet is spread or over/under */}
            {props.bet.proposers_team_id ?
              <>
              {/* spread options */}
              {props.bet.proposers_team_is_home_team ? 
                <DialogContentText id="alert-dialog-description">
                  {props.bet.proposers_first_name} has the {props.bet.home_team_name} {props.bet.home_team_spread > 0 && '+'}{props.bet.home_team_spread} for {props.bet.wager} units this week.
                  <br/>
                  Do you want to take the {props.bet.away_team_name} {props.bet.away_team_spread > 0 && '+'}{props.bet.away_team_spread}?
                </DialogContentText>
              :
                <DialogContentText id="alert-dialog-description">
                  {props.bet.proposers_first_name} has the {props.bet.away_team_name} {props.bet.away_team_spread > 0 && '+'}{props.bet.away_team_spread} for {props.bet.wager} units this week.
                  <br/>
                  Do you want to take the {props.bet.home_team_name} {props.bet.home_team_spread > 0 && '+'}{props.bet.home_team_spread}?
                </DialogContentText>
              }
              </>
            :
            <>
              {/* over/under options */}
              {props.bet.proposers_bet_is_over ?
                <DialogContentText id="alert-dialog-description">
                  {props.bet.proposers_first_name} has Over {props.bet.over_under} for the {props.bet.away_team_name} at the {props.bet.home_team_name}.
                  <br />
                  Do you want to take the Under?
                </DialogContentText>
              :
                <DialogContentText id="alert-dialog-description">
                  {props.bet.proposers_first_name} has Under {props.bet.over_under} for the {props.bet.away_team_name} at the {props.bet.home_team_name}.
                  <br />
                  Do you want to take the Over?
                </DialogContentText>
              }
            </>
          }
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
          </Button>
            <Button onClick={acceptBet} color="primary" autoFocus>
              Accept Bet
          </Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
}

export default connect()(OpenBetRow);