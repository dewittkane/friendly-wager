import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import TabPanel from './TabPanel';
import { Button, withStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = theme => ({
  atLogo: {
    display: 'inline',
    fontSize: '3em',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.5em',
  },
});

class IndividualGame extends Component {

  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_GAME_DETAILS', payload: this.props.match.params.id });
  }

  handleBack = () => {
    this.props.dispatch({ type: 'SET_BACK_STATUS', payload: true });
    this.props.history.goBack();
  }

  render() {

    const { classes } = this.props;
    const game = this.props.store.gameDetails;

    return (
      <div>
        <Button onClick={this.handleBack}>
          <ArrowBackIcon />
        </Button>
        <div className={classes.header}>
          <img src={game.away_team_logo} alt={game.away_team} width="100" height="100"/>
          <h1 className={classes.atLogo}>@</h1>
          <img src={game.home_team_logo} alt={game.home_team} width="100" height="100"/>
        </div>
        {/* {JSON.stringify(this.props.store.gameDetails)} */}
        <TabPanel />
      </div>
    );
  }
}

const IndividualGameStyled = withStyles(styles)(IndividualGame);
export default connect(mapStoreToProps)(IndividualGameStyled);