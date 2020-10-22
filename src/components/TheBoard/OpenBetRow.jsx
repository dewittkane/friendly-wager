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


    function acceptBet(){
      props.dispatch({ 
        type: 'ACCEPT_BET', 
        payload: 
          {
            bet_id: props.bet.id, 
            acceptors_team_id: props.bet.acceptors_team_id
          }
       })
       handleClose();
    }


    return (
               <>
                
                  <TableRow hover classes={{ hover: classes.rowHover }} onClick={handleClickOpen}>
                    {/* Friend */}
                    <TableCell align="right">{props.bet.proposers_first_name} {props.bet.proposers_last_name}</TableCell>
                    {/* Game */}
                    <TableCell align="right">{props.bet.away_team_abbr} @ {props.bet.home_team_abbr}</TableCell>
                    {/* Bet */}
                    {/* checks if proposer is home team */}
                    {props.bet.proposers_team_is_home_team ? 
                          <TableCell align="right">{props.bet.home_team_name} {props.bet.home_team_spread}</TableCell> 
                          :
                          <TableCell align="right">{props.bet.away_team_name} {props.bet.away_team_spread}</TableCell>
                        }
                    {/* Wager */}
                    <TableCell align="right">{props.bet.wager}</TableCell>
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
          <DialogContentText id="alert-dialog-description">
          If you accept {props.bet.proposers_first_name} {props.bet.proposers_last_name}'s bet 
          of {props.bet.wager} units on {props.bet.proposers_team_is_home_team ? props.bet.home_team_name : props.bet.away_team_name} {props.bet.proposers_team_spread} for {props.bet.away_team_abbr} @ {props.bet.home_team_abbr} this
          will become an active bet.
          </DialogContentText>
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