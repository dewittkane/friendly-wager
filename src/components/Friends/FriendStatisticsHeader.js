import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { withRouter } from "react-router";
import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import { deepOrange } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';


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
        paddingTop: '100px'
    },
    // heading: {
    //     paddingLeft: '100px'
    // },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    margin: {
        margin: theme.spacing(1),
      },
    backButton: {
        fontSize: 'medium'
       
      },
      orange: {
        color: theme.palette.getContrastText(deepOrange[500]),
        backgroundColor: deepOrange[500],
      },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }

    
  }));

function FriendStatisticsHeader(props) {
    const classes = useStyles();
    let friendId = Number(props.match.params.id);
    let overall = 0;
    let friendOpenBets = props.store.betReducer.openBetReducer.filter(bet => bet.proposers_id === friendId);
    let ourActiveBets = props.store.betReducer.activeBetReducer.filter(bet => bet.proposers_id === friendId || bet.acceptors_id === friendId);
    let ourCompletedBets = props.store.betReducer.completedBetReducer.filter(bet => bet.oppenent_id === friendId);
    for(let i = 0; i < ourCompletedBets.length; i++){
      if(ourCompletedBets[i].winner === 'W'){
            overall += ourCompletedBets[i].wager;
      } else{
        overall -= ourCompletedBets[i].wager
      }
    }
  return (
      <>
     
    <div className={classes.headingContainer}>
      <Fab color="primary" onClick={() => {props.history.push('/friends')}} aria-label="add">
        <ArrowBackIosSharpIcon className={classes.backButton} />
      </Fab>
    {props.store.friendsList.filter(friend => friend.id === friendId).map(friend => (
      <Typography key={friend.id} variant="h4" color="textPrimary">{friend.first_name}</Typography>
    ))}
    </div>

    <Grid container direction="row" justify="center" alignItems="center" >  
      <Grid item>
        <Typography variant="h6">Total Bets</Typography>
        <br />
        <center>
          <Typography color="textPrimary">{props.store.friendStatistics.length}</Typography>
        </center>
      </Grid> 
      <Grid item>
        <Avatar className={classes.orange}></Avatar>
      </Grid> 
      <Grid item>
      <Typography variant="h6">Open Bets</Typography>
        <br />
        <center>
          <Typography color="textPrimary">{friendOpenBets.length}</Typography>
        </center>
      </Grid> 
    </Grid>

    <div className={classes.historyContainer}>
    <Typography variant="h5">My History with Peter</Typography>
    </div>

    <Grid container direction="row" justify="center" alignItems="center" >  
      <Grid item>
      <Typography variant="h6">Completed Bets</Typography>
        <br />
        <center>
          <Typography color="textPrimary">{ourCompletedBets.length}</Typography>
        </center>
      </Grid> 
      <Grid item>
        <Typography variant="h6">Active Bets</Typography>
        <br />
        <center>
          <Typography color="textPrimary">{ourActiveBets.length}</Typography>
        </center>
      </Grid>
      <Grid item>
        <Typography variant="h6">Overall +/-</Typography>
        <br />
        <center>
          <Typography>{overall}</Typography>
        </center>
      </Grid> 
    </Grid>
   

  
    <div className={classes.root}>
    
    </div>
   
   </>
  );
}

export default connect(mapStoreToProps)(withRouter(FriendStatisticsHeader));
