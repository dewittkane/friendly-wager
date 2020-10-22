import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import BetsTabPanel from './BetsTabPanel'


class MyBets extends Component {

  componentDidMount(){
    this.props.dispatch({type: 'GET_MY_OVERALL_PLUS_MINUS'});
    this.props.dispatch({type: 'GET_MY_OPEN_BETS'});
    this.props.dispatch({type: 'GET_MY_ACTIVE_BETS'})
    this.props.dispatch({type: 'GET_MY_COMPLETED_BETS'});
  }


  render() {
    return (
      <div>
        <h2>My Bets</h2>
        <h4>Overall (+/-) {this.props.store.betReducer.overallPlusMinusReducer.sum}</h4>
        <BetsTabPanel />
      </div>
    );
  }
}

export default connect(mapStoreToProps)(MyBets);
