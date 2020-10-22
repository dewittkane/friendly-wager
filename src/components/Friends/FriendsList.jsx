import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import FriendsListHeading from './FriendsListHeading'
import FriendsListItem from './FriendsListItem'

// Basic class component structure for React with default state
// value setup. When making a new component be sure to replace
// the component name FriendsList with the name for the new
// component.

class FriendsList extends Component {
  state = {
   
  };

  componentDidMount(){
    this.props.dispatch({type: 'GET_FRIENDS'});
  }

  //The reason for unmount is because searching changes friendsList reducer, 
  //so if the user leaves the page in the middle of the search we want friendsList reducer
  //to reset
  componentWillUnmount(){
    this.props.dispatch({type: 'GET_FRIENDS'});
  }

  render() {
    
    return (
      <div>
   
      <FriendsListHeading />
      <FriendsListItem />

      </div>
    );
  }
}

export default connect(mapStoreToProps)(FriendsList);
