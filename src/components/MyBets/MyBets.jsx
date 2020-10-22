import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import BetsTabPanel from './BetsTabPanel'
import { Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
  heading: {
    padding: '1em',
    textAlign: 'center',
    position: 'fixed',
    width: '100%',
    top: 0,
    backgroundColor: '#424242',
    height: '4.5em',
  },
  betsTabPanel: {
    marginTop: '6.5em',
  },
  headingText: {
    marginTop: '.2em',
  },
  headingTextGroup: {
    paddingRight: '1em',
  },
});

class MyBets extends Component {

  componentDidMount() {
    this.props.dispatch({ type: 'GET_MY_OVERALL_PLUS_MINUS' });
  }

  render() {

    const { classes } = this.props;

    let overallSum = this.props.store.betReducer.overallPlusMinusReducer.sum
    //displaying overall sum as 0 if no completed history
    if (overallSum === null) {
      overallSum = 0;
    };

    return (
      <div>
        <div className={classes.heading}>
          <div className={classes.headingTextGroup}>
            <Typography variant="h4" className={classes.headingText} color="textPrimary">My Bets</Typography>
            <Typography color="textPrimary">Overall (+/-) {overallSum}</Typography>
          </div>
        </div>
        <div className={classes.betsTabPanel}>
          <BetsTabPanel />
        </div>
      </div>
    );
  }
}

const MyBetsStyled = withStyles(styles)(MyBets);
export default connect(mapStoreToProps)(MyBetsStyled);