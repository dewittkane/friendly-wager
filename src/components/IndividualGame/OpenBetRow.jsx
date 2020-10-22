import React from 'react';
import { connect } from 'react-redux';

import { Button, TableCell, TableRow } from '@material-ui/core';

  
function OpenBetRow(props) {
  
    return (

                <>
                  <TableRow>
                    {/* Friend */}
                    <TableCell align="right">{props.bet.friend_first_name} {props.bet.friend_last_name}</TableCell>
                    {/* Game */}
                    <TableCell align="right">{props.bet.away_team} @ {props.bet.home_team}</TableCell>
                    {/* Bet */}
                    <TableCell align="right">{props.bet.friends_team}{props.bet.friends_team_spread}</TableCell>
                    {/* Wager */}
                    <TableCell align="right">{props.bet.wager}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4}><Button>Accept Bet</Button></TableCell>
                  </TableRow>
                </>
    );
  }
  
  export default connect()(OpenBetRow);