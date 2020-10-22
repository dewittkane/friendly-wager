import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import {TextField} from '@material-ui/core';


class AddFriend extends Component {

  componentDidMount(){
    this.props.dispatch({type: "GET_MEMBERS", payload: {search: 'All'}});
  }

  handleSearch = () => {
    let nameSearch = document.getElementById('friendSearch').value;
    if(nameSearch !== ''){
      this.props.dispatch({type: "GET_MEMBERS", payload: {search: nameSearch}})
    }
  }

  render() {
    return (
      <div>
        <h2>Add Friends</h2>
        <TextField id="friendSearch" label="Search" variant="outlined" onChange={this.handleSearch}/>
        {this.props.store.memberReducer.map(member => (
          <h3>{member.first_name}</h3>
        ))}
      </div>
    );
  }
}

export default connect(mapStoreToProps)(AddFriend);
