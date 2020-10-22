import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Container,TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from '@material-ui/core';
import { withRouter } from "react-router";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import { deepOrange } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';
import OpenBetRow from '../TheBoard/OpenBetRow'


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    headingContainer: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '30px'
    },
    historyContainer: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '25px',
        paddingBottom: '25px'
    },
    friendOpenBets: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '10px',
      paddingBottom: '10px'
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    margin: {
        margin: theme.spacing(1),
      },
    backButton: {
        fontSize: '3em',
        position: 'relative',
        marginLeft: '.25em',
        marginRight: '1em',
        color: 'white',
    },
    orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
      },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxItem: {
      backgroundColor:'#303030',
      width: '100px',
      borderRadius: '10px'
    },
    boxItemOverall: {
      backgroundColor:'#303030',
      width: '100px',
      height: '75px',
      borderRadius: '10px'
    },
    friendsBetsGrid: {
      paddingBottom: '25px'
    }
    
  }));

function FriendStatisticsHeader(props) {
    const classes = useStyles();
    let friendId = Number(props.match.params.id);
    let friendOpenBets = props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id === friendId);
    let ourActiveBets = props.store.betReducer.activeBetReducer.filter(bet => bet.proposers_id === friendId || bet.acceptors_id === friendId);
    let ourCompletedBets = props.store.betReducer.completedBetReducer.filter(bet => bet.proposers_id === friendId || bet.acceptors_id === friendId);
    let overall = ourCompletedBets.reduce((sum, bet) => {return bet.winners_id === props.store.user.id ? sum += bet.wager : sum -= bet.wager}, 0)

  return (
    <>
      <Button onClick={() => {props.history.push('/friends')}} >
        <ArrowBackIcon className={classes.backButton} />
      </Button>
      <div className={classes.headingContainer}>
        {props.store.friendsList.filter(friend => friend.id === friendId).map(friend => (
          <Typography key={friend.id} variant="h4" color="textPrimary">{friend.first_name} {friend.last_name}</Typography>
        ))}
      </div>

      <Grid className={classes.historyContainer} container direction="row" justify="center" alignItems="center" >  
        <Grid item>
          <Container>
            <Typography variant="h6">Total Bets</Typography>
            <br />
            <center>
              <Typography color="textPrimary">{props.store.friendStatistics.length}</Typography>
            </center>
            </Container>
        </Grid>
        <Grid item>
          <Container>
            <Avatar className={classes.orange}></Avatar>
          </Container>
        </Grid>
        <Grid item>
          <Container>
            <Typography variant="h6">Open Bets</Typography>
            <br />
            <center>
              <Typography color="textPrimary">{friendOpenBets.length}</Typography>
            </center>
          </Container>
        </Grid>
      </Grid>

      <hr></hr>

      <div className={classes.historyContainer}>
        {props.store.friendsList.filter(friend => friend.id === friendId).map(friend => (
          <Typography key={friend.id} variant="h5">My History with {friend.first_name}</Typography>
        ))}
      </div>

      <Grid className={classes.friendsBetsGrid} container direction="row" justify="center" alignItems="center" >  
        <Grid item xs={6}>
          <center>
            <Box className={classes.boxItem}>
              <Typography variant="h6">Completed Bets</Typography>
              <Typography color="textPrimary">{ourCompletedBets.length}</Typography>
            </Box>
          </center>
        </Grid> 
        <Grid item xs={6}>
          <center>
            <Box className={classes.boxItem}>
              <Typography variant="h6">Active Bets</Typography>
              <Typography color="textPrimary">{ourActiveBets.length}</Typography>  
            </Box>            
          </center>
        </Grid>
        <Grid item xs={12}>
          <Container>
            <center>
              <Box className={classes.boxItemOverall}>
                <Typography variant="h6">Overall +/-</Typography>
                <Typography color="textPrimary">{overall}</Typography>
              </Box>
            </center>
          </Container>
        </Grid> 
      </Grid>

      <hr></hr>

      {props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id === friendId).length
        ?
        <>
        <div className={classes.friendOpenBets}>
        {props.store.friendsList.filter(friend => friend.id === friendId).map(friend => (
          <Typography variant="h5">{friend.first_name}'s Open Bets</Typography>
        ))}
        </div>
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
              {props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id === friendId).map((bet) => (
                <OpenBetRow key={bet.id} bet={bet} />
              )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        </>
        :
        <>
          {props.store.friendsList.filter(friend => friend.id === friendId).map(friend => (
            <div className={classes.historyContainer} key={friend.id} >
              <center>
                <Typography color="textPrimary">{friend.first_name} doesn't have any open bets.</Typography>
              </center>
            </div>
          ))}
        </>
      }
    </>
  );
}

export default connect(mapStoreToProps)(withRouter(FriendStatisticsHeader));
