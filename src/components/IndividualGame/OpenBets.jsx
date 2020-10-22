import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import OpenBetRow from './OpenBetRow';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  conditionalText: {
    marginTop: '4.5em',
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  tableContainer: {
    marginTop: '3.5em',
  },
});

function OpenBets(props) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const classes = useStyles();
  const game = props.store.games.filter(game => game.id === Number(props.match.params.id))[0];

  return (
    <>
      {props.store.betReducer.openBetReducer.filter(bet => 
             (bet.proposers_id !== props.store.user.id && bet.game_id === game.id)).length
        ?
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Friend</TableCell>
                <TableCell align="left">Bet</TableCell>
                <TableCell align="center">Wager</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
             {/* only displays bets you didn't propose and belong to this game  */}
             {props.store.betReducer.openBetReducer.filter(bet => 
             (bet.proposers_id !== props.store.user.id && bet.game_id === game.id)).map(bet => (
                <OpenBetRow key={bet.id} bet={bet} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        :
        <Typography color="textPrimary" className={classes.conditionalText}>There aren't any open bets for this game.</Typography>
      }
    </>
  );
}

export default connect(mapStoreToProps)(withRouter(OpenBets));