import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import axios from 'axios';
import { withStyles } from '@material-ui/core';
import TabPanel from './TabPanel';
import LogOutButton from '../BottomNavBar/LogOutButton';
import convertDate from './check-week';

const styles = theme => ({
  container: {
    padding: '1em',
  },
  weekSpan: {
    marginLeft: '1em',
    fontSize: '.50em',
  },
});

class TheBoard extends Component {

  componentDidMount() {
    const currentWeek = convertDate();
    this.props.dispatch({ type: 'FETCH_GAMES', payload: currentWeek });
  }

  render() {

    const { classes } = this.props;
    const currentWeek = this.props.store.games[0];

    return (
      <div>
        <div className={classes.container}>
          <h1>The Board<span className={classes.weekSpan}>
            Week {currentWeek && currentWeek.week}
          </span></h1>
        </div>
        <TabPanel />
        <button onClick={() => axios.get('/api/games/fromNflApi')}>API CALL - USE WITH CAUTION</button>
        {/* <LogOutButton className="log-in" /> */}
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
const TheBoardStyled = withStyles(styles)(TheBoard);
export default connect(mapStoreToProps)(TheBoardStyled);
