import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import FriendsListHeading from './FriendsListHeading'
import FriendsListItem from './FriendsListItem'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

});

class FriendsList extends Component {

  componentDidMount() {
    this.props.dispatch({ type: 'GET_FRIENDS' });
  }

  //The reason for unmount is because searching changes friendsList reducer, 
  //so if the user leaves the page in the middle of the search we want friendsList reducer
  //to reset
  componentWillUnmount() {
    this.props.dispatch({ type: 'GET_FRIENDS' });
  }

  render() {

    const { classes } = this.props;

    return (
      <div>

        <FriendsListHeading />
        <FriendsListItem />

      </div>
    );
  }
}

const FriendsListStyled = withStyles(styles)(FriendsList);
export default connect(mapStoreToProps)(FriendsListStyled);
