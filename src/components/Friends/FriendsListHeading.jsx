import React from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, TextField, InputAdornment } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { withRouter } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151515',

  },
  headingContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '6.5em',
  },
  heading: {
    paddingRight: '20px',
    color: 'white',
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  multilineColor: {
    color: 'white',
    borderColor: 'green !important'
    
  },
  borderColor: {
    color: 'white !important',
    borderColor: 'white !important',
  },
  cssLabel: {
    color: 'white'
  },
  addButton: {
    float: "right",
    color: 'white',
    fontSize: '2.5em',
    position: 'relative',
    top: '2px',
  },
  margin: {
    margin: theme.spacing(1),
  },
  search: {
    
  },
  notchedOutline: {
    borderWidth: '1px',
    borderColor: 'white !important'
  },
  mainContainer: {
    position: 'fixed',
    zIndex: '20',
    width: '100%',
    top: 0,
    backgroundColor: '#303030'
  },
}));


function FriendsListHeading(props) {
  const classes = useStyles();


  const handleSearch = (event) => {
    let nameSearch = event.target.value;
    if (nameSearch !== '') {
      props.dispatch({ type: "GET_FRIENDS_SEARCH", payload: { search: nameSearch, type: 'friend' } })
    }
    if (nameSearch === '') {
      props.dispatch({ type: "GET_FRIENDS" })
    }
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.headingContainer}>
        <Typography variant="h4" className={classes.heading}>My Friends</Typography>
        <AddIcon className={classes.addButton} onClick={() => props.history.push("/friends/add")} />
      </div>
      <div className={classes.root}>
        <div className={classes.search}>
          <TextField
          className={classes.searchfield}
            id="searchfriend"
            onChange={handleSearch}
            style={{color: '#01FF70'}}
            label="Search Friends"
            margin="normal"
            variant="outlined"
            InputProps={{
              classes: {
                root: classes.notchedOutline,
                focused: classes.multilineColor,
                notchedOutline: classes.notchedOutline
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{color: '#01FF70'}}/>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.borderColor,
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default connect(mapStoreToProps)(withRouter(FriendsListHeading));
