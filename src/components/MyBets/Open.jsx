import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles, Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Button } from '@material-ui/core'
import moment from 'moment';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles({
  tableContainer: {
    marginTop: '3.5em',
  }, 
  conditionalText: {
    marginTop: '4.5em',
    paddingLeft: '24px',
    paddingRight: '24px',
  }
});

function Open(props) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <>
      {props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id === props.store.user.id).length
        ?
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Date</TableCell>
                <TableCell align="center">Game</TableCell>
                <TableCell align="left">My Bet</TableCell>
                <TableCell align="left">Wager</TableCell>
                <TableCell align="left">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* only displays your proposed bets */}
              {props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id === props.store.user.id).map(bet => (
                <TableRow key={bet.id}>
                  <TableCell align="left">{moment(bet.date).format("M/D")}</TableCell>
                  <TableCell align="left">{bet.away_team_abbr} @ {bet.home_team_abbr}</TableCell>
                  {/* determines if bet is spread or O/U */}
                  {bet.proposers_team_id ? 
                    <>
                      {/* checks if proposer is home team */}
                      {bet.proposers_team_is_home_team ?
                        <TableCell align="left">{bet.home_team_name} <br/>{bet.home_team_spread > 0 && '+'}{bet.home_team_spread}</TableCell>
                        :
                        <TableCell align="left">{bet.away_team_name} <br/>{bet.away_team_spread > 0 && '+'}{bet.away_team_spread}</TableCell>
                      }
                    </>
                  :
                    <TableCell align="left">
                      {/* determines if proposer has over */}
                      {bet.proposers_bet_is_over ?
                        <Typography variant="body2">Over <br/>{bet.over_under}</Typography>
                        :
                        <Typography variant="body2">Under <br/>{bet.over_under}</Typography>
                      } 
                    </TableCell>
                  }
                  <TableCell align="center">{bet.wager}u</TableCell>
                  <TableCell align="center">
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
        <Typography color="textPrimary" className={classes.conditionalText}>You haven't opened any bets yet.</Typography>
      }
    </>
  );
}

export default connect(mapStoreToProps)(Open);
