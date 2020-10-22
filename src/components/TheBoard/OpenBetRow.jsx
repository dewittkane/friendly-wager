import React from 'react';
import { connect } from 'react-redux';

import { Button, TableCell, TableRow } from '@material-ui/core';


  
function OpenBetRow(props) {

    function acceptBet(){
      props.dispatch({ 
        type: 'ACCEPT_BET', 
        payload: 
          {
            bet_id: props.bet.id, 
            acceptors_team_id: props.bet.acceptors_team_id
          }
       })
    }

    return (

                <>
                  <TableRow>
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
                  <TableRow>
                    <TableCell colSpan={4}><Button color="primary" variant="contained" onClick={() => acceptBet()}>Accept Bet</Button></TableCell>
                  </TableRow>
                </>
    );
  }
  
  export default connect()(OpenBetRow);