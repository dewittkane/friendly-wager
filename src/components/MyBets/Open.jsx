import React from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@material-ui/core'
import moment from 'moment';

function Open(props) {

  return (
    <>
      {props.store.betReducer.openBetReducer[0]
        ?
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Date</TableCell>
                <TableCell align="center">Game</TableCell>
                <TableCell align="left">My Bet</TableCell>
                <TableCell align="left">Wager</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
               {/* only displays your proposed bets */}
               {props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id === props.store.user.id).map(bet => (
                <TableRow key={bet.id}>
                  <TableCell align="left">{moment(bet.date_played).format("M/D")}</TableCell> 
                  <TableCell align="left">{bet.away_team_abbr} @ {bet.home_team_abbr}</TableCell>
                  {/* checks if proposer is home team */}
                  {bet.proposers_team_is_home_team ? 
                    <TableCell align="left">{bet.home_team_name} {bet.home_team_spread}</TableCell> 
                    :
                    <TableCell align="left">{bet.away_team_name} {bet.away_team_spread}</TableCell>
                  }
                  <TableCell align="left">{bet.wager}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        :
        <Typography>You haven't opened any bets yet.</Typography>
      }
    </>
  );
}

export default connect(mapStoreToProps)(Open);
