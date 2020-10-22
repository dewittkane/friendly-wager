import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import CreateBetForm from './CreateBetForm';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography, Button, TableHead } from '@material-ui/core';


const useStyles = makeStyles({
  createBetForm: {
    textAlign: 'center',
    marginBottom: '3.5em',
    backgroundColor: '#151515',
  },
  text: {
    marginTop: '1em',
    marginBottom: '.25em',
    paddingLeft: '24px',
    paddingRight: '24px',
    backgroundColor: '#151515',
  },
  creatBet: {
    marginBottom: '1em',
  },
  openBets: {
    marginTop: '2.75em',
    backgroundColor: '#151515',
  },
  tableContainer: {
    marginBottom: '1.5em',
  },
});

function MyBets(props) {

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

  const game = props.store.games.filter(game => game.id === Number(props.match.params.id))[0];

  return (
    <div>
      <div>
        <Container>
          <Typography variant="h5" color="textPrimary" className={classes.openBets}>My Open Bets</Typography>
        </Container>
        {props.store.betReducer.openBetReducer.filter(bet =>
          (bet.proposers_id === props.store.user.id && bet.game_id === game.id)).length
          ?
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">My Bet</TableCell>
                  <TableCell align="center">Wager</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* only shows your open bets for this particular game */}
                {props.store.betReducer.openBetReducer.filter(bet =>
                  (bet.proposers_id === props.store.user.id && bet.game_id === game.id)).map(bet =>
                    (<TableRow key={bet.id}>
                      {/* determines if bet is spread or O/U */}
                      {bet.proposers_team_id ?                      
                        <>
                          {/* determines if proposer has home team stats */}
                          {bet.proposers_team_is_home_team ?
                            <TableCell align="left">{bet.home_team_name} {(bet.home_team_spread > 0) && '+'}{bet.home_team_spread}</TableCell>
                            :
                            <TableCell align="left">{bet.away_team_name} {(bet.away_team_spread > 0) && '+'}{bet.away_team_spread}</TableCell>
                          } 
                        </>
                      :
                        <>
                          {/* determines if proposer has over */}
                          {bet.proposers_bet_is_over ?
                            <TableCell align="left">Over {bet.over_under}</TableCell>
                            :
                            <TableCell align="left">Under {bet.over_under}</TableCell>
                          } 
                        </>
                      }
                      <TableCell align="center">
                        {bet.wager}u
                      </TableCell>
                      <TableCell align="center">
                        <DeleteIcon style={{color: '#662424'}} onClick={handleClickOpen} />
                      </TableCell>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle style={{backgroundColor: '#303030'}}>{`Delete open bet?`}</DialogTitle>
                        <DialogActions style={{backgroundColor: '#303030'}}>
                          <Button style={{backgroundColor: '#303030', color: 'white'}} onClick={handleClose} color="primary">
                            Cancel
                          </Button>
                          <Button style={{backgroundColor: '#303030', color: 'white'}} onClick={() => handleDelete(bet.id)} color="primary" autoFocus>
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
        <Container>
          <Typography variant="h5" color="textPrimary" style={{backgroundColor: '#151515'}}>My Active Bets</Typography>
        </Container>
        {props.store.betReducer.activeBetReducer.filter(bet =>
          (bet.game_id === game.id)).length ?
          <TableContainer id="myBetTableTwo" component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">My Bet</TableCell>
                  <TableCell align="left">Against</TableCell>
                  <TableCell align="center">Wager</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* filters only active bets for this game */}
                {props.store.betReducer.activeBetReducer.filter(bet =>
                  (bet.game_id === game.id)).map(bet => (
                    <TableRow key={bet.id}>
                      {/* determines if bet is spread or O/U */}
                      {bet.proposers_team_id ? 
                      <>     
                        {bet.proposers_id === props.store.user.id ?
                      bet.proposers_team_is_home_team ?
                        //user is proposer and team is home
                        <>
                          <TableCell align="left">{bet.home_team_name} {(bet.home_team_spread > 0) && '+'}{bet.home_team_spread}</TableCell>
                          <TableCell align="left">{bet.acceptors_first_name} {bet.acceptors_last_name}</TableCell>
                        </>
                        :
                        //user is proposer and team is away
                        <>
                          <TableCell align="left">{bet.away_team_name} {(bet.away_team_spread > 0) && '+'}{bet.away_team_spread}</TableCell>
                          <TableCell align="left">{bet.acceptors_first_name} {bet.acceptors_last_name}</TableCell>
                        </>
                      :
                      bet.proposers_team_is_home_team ?
                        //user is acceptor and team is away
                        <>
                          <TableCell align="left">{bet.away_team_name} {(bet.away_team_spread > 0) && '+'}{bet.away_team_spread}</TableCell>
                          <TableCell align="left">{bet.proposers_first_name} {bet.proposers_last_name}</TableCell>
                        </>
                        :
                        //user is acceptor and team is home
                        <>
                          <TableCell align="left">{bet.home_team_name} {(bet.home_team_spread > 0) && '+'}{bet.home_team_spread}</TableCell>
                          <TableCell align="left">{bet.proposers_first_name} {bet.proposers_last_name}</TableCell>
                        </>
                    }
                  </>
                  :
                  <>
                  
                    {bet.proposers_id === props.store.user.id ?
                    <>
                      {bet.proposers_bet_is_over ?
                        //user is proposer and bet is over
                        <>
                          <TableCell align="left">Over {bet.over_under}</TableCell>
                          <TableCell align="left">{bet.acceptors_first_name} {bet.acceptors_last_name}</TableCell>
                        </>
                        :
                        //user is proposer and bet is under
                        <>                          
                          <TableCell align="left">Under {bet.over_under}</TableCell>
                          <TableCell align="left">{bet.acceptors_first_name} {bet.acceptors_last_name}</TableCell>
                        </>
                      } 
                    </>
                    :
                    <>
                      {bet.proposers_bet_is_over ?
                        //user is acceptor and proposers bet is over
                        <>
                          <TableCell align="left">Under {bet.over_under}</TableCell>
                          <TableCell align="left">{bet.proposers_first_name} {bet.proposers_last_name}</TableCell>
                        </>
                        :                        
                        //user is acceptor and proposers bet is under
                        <>                          
                          <TableCell align="left">Over {bet.over_under}</TableCell>
                          <TableCell align="left">{bet.proposers_first_name} {bet.proposers_last_name}</TableCell>
                        </>
                      } 
                    </>}
                  </>
                }
                  <TableCell align="center">{bet.wager}u</TableCell>
                    </TableRow>
                  )
                  )}
              </TableBody>
            </Table>
          </TableContainer>
          :
          <Typography color="textPrimary" className={classes.text}>You don't have any active bets for this game.</Typography>
        }
      </div>
      <Container className={classes.createBetForm}>
        <Typography variant="h5" color="textPrimary" className={classes.text}>Create Bet</Typography>
        <CreateBetForm />
      </Container>
    </div>
  );
}

export default connect(mapStoreToProps)(withRouter(MyBets));