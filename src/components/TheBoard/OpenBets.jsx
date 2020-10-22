import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import React from 'react';
import OpenBetRow from './OpenBetRow';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';

//2.1 
const useStyles = makeStyles({
});

function OpenBets(props) {

  const classes = useStyles();

  return (
    <>
      {props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id !== props.store.user.id).length
        ?
        <TableContainer component={Paper}>
          <Table aria-label="simple table" className={classes.tableContainer}>
            <TableHead>
              <TableRow>
                <TableCell align="left">Friend</TableCell>
                <TableCell align="left">Game</TableCell>
                <TableCell align="left">Bet</TableCell>
                <TableCell align="center">Wager</TableCell>
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
        <Container>
          <Typography color="textPrimary">Your friends haven't opened any bets yet.</Typography>
        </Container>
      }
    </>
  );
}

export default connect(mapStoreToProps)(OpenBets);