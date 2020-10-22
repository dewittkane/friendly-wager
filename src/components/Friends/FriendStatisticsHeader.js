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
    statsText: {
      fontSize: '24px'
    },
    statsHeader: {
      borderBottom: '2px solid white',
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
    goBackButton: {
      fontSize: '5em',
      position: 'relative',
      paddingLeft: '.25em',
      paddingBottom: '.1em',
      backgroundColor: '#151515'
    },
    icon: {
      fontSize: '3em',
      backgroundColor: '#151515'
    },
    goBackButton: {
      backgroundColor: '#151515'
    },
    avatar: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
        width: '4em',
        height: '4em',
      },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    boxItem: {
      backgroundColor:'#303030',
      width: '160px',
      borderRadius: '10px'
    },
    boxItemOverall: {
      backgroundColor:'#303030',
      width: '140px',
      height: '60px',
      borderRadius: '10px',
      marginBottom: '10px'
    },
    friendsBetsGrid: {
      paddingBottom: '25px',
      backgroundColor: '#151515'
    }
    
  }));

function FriendStatisticsHeader(props) {
    const classes = useStyles();
    let friendId = Number(props.match.params.id);
    let imageRow = props.store.friendsList.filter(friend => friend.id === friendId)
    let friendOpenBets = props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id === friendId);
    let ourActiveBets = props.store.betReducer.activeBetReducer.filter(bet => bet.proposers_id === friendId || bet.acceptors_id === friendId);
    let ourCompletedBets = props.store.betReducer.completedBetReducer.filter(bet => bet.proposers_id === friendId || bet.acceptors_id === friendId);
    let overall = ourCompletedBets.reduce((sum, bet) => {return bet.winners_id === props.store.user.id ? sum += bet.wager : sum -= bet.wager}, 0)
   console.log(imageRow);

  
  
  return (
    <>
    <Button className={classes.goBackButton} onClick={() => props.history.goBack()}>
                <ArrowBackIcon className={classes.icon} />
              </Button>
      <div className={classes.headingContainer}>
        {props.store.friendsList.filter(friend => friend.id === friendId).map(friend => (
          <Typography key={friend.id} variant="h4" color="white">{friend.first_name} {friend.last_name}</Typography>
        ))}
      </div>

      <Grid className={classes.historyContainer} container direction="row" justify="center" alignItems="center" >  
        <Grid item>
          <Container>
            <Typography color="white" className={classes.statsHeader} variant="h6">Total Bets</Typography>
            <br />
            <center>
              <Typography className={classes.statsText} color="white">{props.store.friendStatistics.length}</Typography>
            </center>
            </Container>
        </Grid>
        <Grid item>
          <Container>
            {/* Ternary on avatar source because if you refresh with friends list empty you get error */}
            <Avatar src={(props.store.friendsList[0]) ? imageRow[0].image_url : null} className={classes.avatar}></Avatar>
          </Container>
        </Grid>
        <Grid item>
          <Container>
            <Typography color="white" className={classes.statsHeader} variant="h6">Open Bets</Typography>
            <br />
            <center>
              <Typography className={classes.statsText} color="white">{friendOpenBets.length}</Typography>
            </center>
          </Container>
        </Grid>
      </Grid>

      <hr></hr>

      <div className={classes.historyContainer}>
        {props.store.friendsList.filter(friend => friend.id === friendId).map(friend => (
          <Typography key={friend.id} color="white" variant="h5">My History with {friend.first_name}</Typography>
        ))}
      </div>

      <Grid className={classes.friendsBetsGrid} container direction="row" justify="center" alignItems="center" >  
      <Grid item xs={12}>
          <Container>
            <center>
              <Box item className={classes.boxItemOverall}>
                <Typography variant="h6">Overall +/-</Typography>
                <Typography color="textPrimary">{overall}</Typography>
              </Box>
            </center>
          </Container>
        </Grid> 
        <Grid item xs={6}>
          <center>
            <Box item className={classes.boxItem}>
              <Typography color="white"  variant="h6">Completed Bets</Typography>
              <Typography color="white">{ourCompletedBets.length}</Typography>
            </Box>
          </center>
        </Grid> 
        <Grid item xs={6}>
          <center>
            <Box item className={classes.boxItem}>
              <Typography color="white" variant="h6">Active Bets</Typography>
              <Typography color="white">{ourActiveBets.length}</Typography>  
            </Box>            
          </center>
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
