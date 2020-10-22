import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { withStyles, Typography } from '@material-ui/core';
import TabPanel from './TabPanel';
import convertDate from './check-week';

const styles = theme => ({
  heading: {
    padding: '1em',
    textAlign: 'center',
    position: 'fixed',
    width: '100%',
    top: 0,
    backgroundColor: '#303030',
    height: '4.5em',
  },
  tabPanel: {
    marginTop: '6.5em',
  },
  headingText: {
    marginTop: '.2em',
  },
  headingTextGroup: {
    paddingRight: '1em',
    color: 'white',
  },
});

class TheBoard extends Component {

  componentDidMount() {
    
    //only fetchs games if games aren't already there
    if(this.props.store.games.length === 0) {
      const currentWeek = convertDate();
      this.props.dispatch({ type: 'FETCH_GAMES', payload: currentWeek });
    }
    //only fetchs bets if bets aren't already there
    if(this.props.store.betReducer.openBetReducer.length === 0)
    this.props.dispatch({ type: 'FETCH_BETS' });
  }

  render() {

    const { classes } = this.props;
    const currentWeek = this.props.store.games[0];

    return (
      <div>
        <div className={classes.heading}>
          <div className={classes.headingTextGroup}>
            <Typography variant="h4" className={classes.headingText}>The Board</Typography>
            <Typography>Week {currentWeek && currentWeek.week}</Typography>
          </div>
        </div>
        <div className={classes.tabPanel}>
          <TabPanel />
        </div>
      </div>
    );
  }
}

const TheBoardStyled = withStyles(styles)(TheBoard);
export default connect(mapStoreToProps)(TheBoardStyled);
