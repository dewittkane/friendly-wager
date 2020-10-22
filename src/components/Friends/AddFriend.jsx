import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { withStyles, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Button, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import { deepOrange } from '@material-ui/core/colors';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = theme => ({
  rootContainer: {
    padding: 10,
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
  mainDiv: {
    marginBottom: '3.5em',
  },
  notchedOutline: {
    borderWidth: '1px',
    borderColor: 'white !important'
  },
  avatar: {
    color: 'white',
    backgroundColor: '#606060',
  },
  textField: {
    align: "center"
  },
  conditionalText: {
    marginTop: '1.5em',
    paddingLeft: '24px',
    paddingRight: '24px',
    color: 'white',
  },
  backButton: {
    fontSize: '3em',
    position: 'relative',
    paddingLeft: '.25em',
  },
  heading: {
    textAlign: 'center',
    display: 'flex',
    height: '5em',
    paddingTop: '.75em',
    paddingBottom: '.75em',
    position: 'fixed',
    width: '100%',
    top: 0,
    backgroundColor: '#303030',
    zIndex: '20',
  },
  searchAbility: {
    marginTop: '6.5em',
    width: '100%',
    backgroundColor: '#151515',
  },
  addFriendText: {
    marginLeft: '1em',
    color: 'white',
    marginTop: '.5em',
  },
  mainHeading: {
    zIndex: '20',
    backgroundColor: '#303030',
    width: '100%',
    top: 0,
    position: 'fixed'
  },
  listContainer: {
    marginTop: '12em'
  }
 
});

class AddFriend extends Component {
  state = {
    open: false
  }


  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      open: false
    })
  };

  componentWillUnmount() {
    this.props.dispatch({ type: "UNSET_MEMBERS"});
  }
  
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  // function to handle searching for a member by name
  handleSearch = () => {
    let nameSearch = document.getElementById('friendSearch').value;
    console.log(nameSearch);
    if (nameSearch !== '') {
      this.props.dispatch({ type: "GET_MEMBERS", payload: { search: nameSearch, type: 'members' } })
    }
    if (nameSearch === '') {
      this.props.dispatch({ type: "UNSET_MEMBERS"})
    }
    
  }

  // function to add a friend
  addFriend = (id) => {
    this.setState({
      open: true
    })
    this.props.dispatch({ type: "ADD_FRIEND", payload: { friendId: id } })
   
    document.getElementById('friendSearch').value = '';
  }

  render() {
    const { classes } = this.props;
    const item = this.props.store.memberReducer;
    return (
      <>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }}open={this.state.open} autoHideDuration={3000} onClose={this.handleClose}>
          <Alert onClose={this.handleClose} severity="success">
            Added to Friends List!
      </Alert>
        </Snackbar>
        <div className={classes.mainDiv}>
          <div className={classes.mainHeading}>
            <div className={classes.heading}>
              <Button onClick={() => this.props.history.goBack()}>
                <ArrowBackIcon className={classes.backButton} />
              </Button>
              <Typography variant="h4" className={classes.addFriendText}>Add Friends</Typography>
            </div>
            <div className={classes.searchAbility}>
              <center>
            <TextField
            ref={'textForm'}
          className={classes.searchfield}
            id="friendSearch"
            onChange={this.handleSearch}
            style={{color: '#01FF70'}}
            label="Search Members"
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
          </center>
            </div>
          </div>
          <div className={classes.listContainer}>
            {this.props.store.memberReducer[0]
              ?
              <List>
                {this.props.store.memberReducer.map(member => (
                  <ListItem key={member.id}>
                    <ListItemAvatar><Avatar className={classes.avatar} src={member.image_url}>{member.first_name[0].toUpperCase()}{member.last_name[0].toUpperCase()}</Avatar></ListItemAvatar>
                    <ListItemText primary={<Typography style={{color: 'white'}}>{member.first_name} {member.last_name}</Typography>}/>
                    <ListItemSecondaryAction><IconButton onClick={() => this.addFriend(member.id)}><AddIcon style={{color: 'white'}}/></IconButton></ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              :
              <Typography className={classes.conditionalText}>Search for friends by name.</Typography>
            }
          </div>
        </div>
      </>
    );
  }
}

export default connect(mapStoreToProps)(withStyles(styles)(AddFriend));