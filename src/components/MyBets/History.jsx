import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles, Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@material-ui/core';
import moment from 'moment';

const useStyles = makeStyles({
  table: {
    flexGrow: 1
  },
  tableContainer: {
    marginTop: '2.9em',
  },
  conditionalText: {
    marginTop: '4.5em',
    paddingLeft: '24px',
    paddingRight: '24px',
    backgroundColor: '#151515',
  }
});

function History(props) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const classes = useStyles();

  return (
    <>
      {props.store.betReducer.completedBetReducer.length
        ?
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Date</TableCell>
                <TableCell align="center">Game</TableCell>
                <TableCell align="left">Against</TableCell>
                <TableCell align="left">My Bet</TableCell>
                <TableCell align="left">W/L</TableCell>
                <TableCell align="left">Wager</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.store.betReducer.completedBetReducer.map(bet => (
                <TableRow key={bet.id}>
                  <TableCell align="left">{moment(bet.date).format("M/D")}</TableCell>
                  <TableCell align="left">{bet.home_team_abbr} @ {bet.away_team_abbr}</TableCell>
                  {bet.proposers_id === props.store.user.id ?
                    <TableCell align="left">{bet.acceptors_first_name}</TableCell>
                    :
                    <TableCell align="left">{bet.proposers_first_name}</TableCell>
                  } 
                  {/* determines if bet is spread or O/U */}
                  {bet.proposers_team_id ? 
                  <>
                  {bet.proposers_id === props.store.user.id ?
                    bet.proposers_team_is_home_team ?
                      //user is proposer and team is home
                        <TableCell align="left">{bet.home_team_abbr} {bet.home_team_spread > 0 && '+'}{bet.home_team_spread}</TableCell>
                      :
                      //user is proposer and team is away
                        <TableCell align="left">{bet.away_team_abbr} {bet.away_team_spread > 0 && '+'}{bet.away_team_spread}</TableCell>
                    :
                    bet.proposers_team_is_home_team ?
                      //user is acceptor and team is away
                        <TableCell align="left">{bet.away_team_abbr} {bet.away_team_spread > 0 && '+'}{bet.away_team_spread}</TableCell>
                      :
                      //user is acceptor and team is home
                        <TableCell align="left">{bet.home_team_abbr} {bet.home_team_spread > 0 && '+'}{bet.home_team_spread}</TableCell>
                  }
                  </>
                  :
                  <>
                    {bet.proposers_id === props.store.user.id ?
                    <>
                      {bet.proposers_bet_is_over ?
                        //user is proposer and bet is over
                          <TableCell align="left">Over {bet.over_under}</TableCell>
                        :
                        //user is proposer and bet is under
                          <TableCell align="left">Under {bet.over_under}</TableCell>
                      } 
                    </>
                    :
                    <>
                      {bet.proposers_bet_is_over ?
                        //user is acceptor and proposers bet is over
                          <TableCell align="left">Under {bet.over_under}</TableCell>
                        :                        
                        //user is acceptor and proposers bet is under
                          <TableCell align="left">Over {bet.over_under}</TableCell>
                      } 
                    </>}
                  </>
                }
                  <TableCell align="left">{bet.winners_id === props.store.user.id ? "W" : "L"}</TableCell>
                  <TableCell align="left">{bet.wager}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        :
        <Typography color="textPrimary" className={classes.conditionalText}>You haven't completed any bets yet.</Typography>
      }
    </>
  );
}

export default connect(mapStoreToProps)(History);
