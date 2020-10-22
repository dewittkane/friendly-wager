import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import FriendsListHeading from './FriendsListHeading'


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

  render() {
    
    return (
      <div>
        <FriendsListHeading />

      </div>
    );
  }
}

export default connect(mapStoreToProps)(FriendsList);
