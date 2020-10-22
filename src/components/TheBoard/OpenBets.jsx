import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import React, {useEffect} from 'react';
import OpenBetRow from './OpenBetRow';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container } from '@material-ui/core';

//2.1 
const useStyles = makeStyles({
  tableContainer: {
    marginTop: '1em',
    backgroundColor: '#151515',
  },
  conditionalText: {
    padding: '24px',
    paddingTop: '32px',
  },
});

function OpenBets(props) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const classes = useStyles();

  return (
    <>
      {props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id !== props.store.user.id).length
        ?
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table aria-label="simple table" className={classes.tableContainer}>
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{color: 'white'}}>Friend</TableCell>
                <TableCell align="left" style={{color: 'white'}}>Game</TableCell>
                <TableCell align="left" style={{color: 'white'}}>Bet</TableCell>
                <TableCell align="center" style={{color: 'white'}}>Wager</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* only displays open bets that you didn't propose */}
              {props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id !== props.store.user.id).map((bet) => (
                <OpenBetRow key={bet.id} bet={bet} />
              )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        :
          <Typography color="textPrimary" className={classes.conditionalText}>Your friends haven't opened any bets yet.</Typography>
      }
    </>
  );
}

export default connect(mapStoreToProps)(OpenBets);