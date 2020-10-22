import React, { useState } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withRouter } from "react-router";

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
    },
    heading: {
        paddingRight: '100px'
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    margin: {
        margin: theme.spacing(1),
      },

      search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: 300,
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 300,
        },
      },
  }));
  

function FriendsListHeading(props) {
    const classes = useStyles();
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const [heading] = useState('My Friends');
  
  return (
      <>
      <center>
    <div className={classes.headingContainer}>
      <h2 className={classes.heading}>{heading}</h2>
      <Fab color="primary" className={classes.addButton} aria-label="add">
        <AddIcon onClick={()=>props.history.push("/friends/add")}/>
      </Fab>
    </div>
    </center>
   
    <div className={classes.root}>
    <div className={classes.search}>
    <Autocomplete
      id="free-solo-demo"
      freeSolo
      //Change mapping for friends 
      options={props.store.friendsList.map((option) => option.first_name + " " + option.last_name)}
      renderInput={(params) => (
        <TextField
        {...params} 
        label= "Search Friends" 
        margin="normal" 
        variant="outlined"
        InputProps={{
        ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
        
      )}
    />
    </div>
    </div>
   
   </>
  );
}

export default connect(mapStoreToProps)(withRouter(FriendsListHeading));
