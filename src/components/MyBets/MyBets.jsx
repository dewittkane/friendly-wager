import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import BetsTabPanel from './BetsTabPanel'
import { Typography } from '@material-ui/core';


class MyBets extends Component {

  componentDidMount(){
    this.props.dispatch({type: 'GET_MY_OVERALL_PLUS_MINUS'});
    this.props.dispatch({type: 'FETCH_BET_HISTORY'});
  }

  render() {

    let overallSum = this.props.store.betReducer.overallPlusMinusReducer.sum
    //displaying overall sum as 0 if no completed history
    if (overallSum === null) {
      overallSum = 0;
    };

    return (
      <div>
        <h2>My Bets</h2>
        <h4>Overall (+/-) {overallSum}</h4>
        <BetsTabPanel />
      </div>
    );
  }
}

export default connect(mapStoreToProps)(MyBets);
