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
    heading: {
        paddingLeft: '100px'
    },
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
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const [heading, setHeading] = useState('');
  
  useEffect(() => {
    setHeading('Peter Engstrand')
  }, []);

  return (
      <>
     
    <div className={classes.headingContainer}>
      <Fab color="primary" onClick={() => {props.history.push('/friends')}} aria-label="add">
        <ArrowBackIosSharpIcon className={classes.backButton} />
      </Fab>
      <h2 className={classes.heading}>{heading}</h2>
    </div>
    <Grid
    container
    direction="row"
    justify="center"
    alignItems="center"
    spacing={5}>  
    <Grid item><b>Total Bets</b>
    <br /><center>8</center></Grid> 
    <Grid item>
    <Avatar className={classes.orange}>
    {heading[0]}
    </Avatar>
    </Grid> 
    <Grid item><b>Pending Bets</b>
    <br /><center>5</center>
    </Grid> 
    </Grid>
    <div className={classes.historyContainer}>
    <h3>My History with Peter</h3>
    </div>
    <Grid
    container
    direction="row"
    justify="center"
    alignItems="center"
    spacing={5}>  
    <Grid item><b>Total Bets</b>
    <br /><center>2</center></Grid> 
    <Grid item><b>Pending Bets</b>
    <br /><center>4</center>
    </Grid> 
    </Grid>
   

  
    <div className={classes.root}>
    
    </div>
   
   </>
  );
}

export default connect(mapStoreToProps)(withRouter(FriendStatisticsHeader));
