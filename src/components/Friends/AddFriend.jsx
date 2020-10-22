import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import {withStyles, TextField, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Button} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
  mainDiv: {
    // margin: 10,
    marginBottom: '3.5em',
  },
})
class AddFriend extends Component {

  componentDidMount(){
    this.props.dispatch({type: "GET_MEMBERS", payload: {search: 'All'}});
  }

  // function to handle searching for a member by name
  handleSearch = () => {
    let nameSearch = document.getElementById('friendSearch').value;
    if(nameSearch !== ''){
      this.props.dispatch({type: "GET_MEMBERS", payload: {search: nameSearch}})
    }
    if(nameSearch === ''){
      this.props.dispatch({type: "GET_MEMBERS", payload: {search: 'All'}})
    }
  }

  // function to add a friend
  addFriend = (id) => {
    this.props.dispatch({type: "ADD_FRIEND", payload: {friendId: id}})
  }

  render()
  {
    const {classes} = this.props;
    return (
      <div className={classes.mainDiv}>
        <Button onClick={()=>this.props.history.goBack()}>
           <ArrowBackIcon/>
        </Button>
        <h2>Add Friends</h2>
        <SearchIcon fontSize="large"/><TextField id="friendSearch" label="Search" variant="outlined" onChange={this.handleSearch}/>
        <List>
          {this.props.store.memberReducer.map(member => (
            <ListItem key={member.id}>
              <ListItemAvatar><Avatar/></ListItemAvatar>
              <ListItemText primary={`${member.first_name} ${member.last_name}`}/>
              <ListItemSecondaryAction><IconButton onClick={()=>this.addFriend(member.id)}><AddIcon/></IconButton></ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

export default connect(mapStoreToProps)(withStyles(styles)(AddFriend));
