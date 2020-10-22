import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import TabPanel from './TabPanel';
import { Button, withStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';

const styles = theme => ({
  backButton: {
    fontSize: '3em',
    position: 'relative',
    marginLeft: '.25em',
    marginRight: '1em',
  },
  atLogo: {
    fontSize: '1.5em',
    color: 'white',
    padding: '.2em',
    position: 'relative',
  },
  heading: {
    textAlign: 'center',
    display: 'flex',
    height: '5em',
    paddingTop: '.75em',
    paddingBottom: '.75em',
    position: 'fixed',
    width: '100%',
    top: 0,
    backgroundColor: '#424242',
  },
  tabPanel: {
    marginTop: '6.5em',
  },
});

class IndividualGame extends Component {

  handleBack = () => {
    this.props.dispatch({ type: 'SET_BACK_STATUS', payload: true });
    this.props.history.goBack();
  }

  render() {

    const { classes } = this.props;
    const game = this.props.store.games.filter(game => game.id === Number(this.props.match.params.id))[0];
    console.log(game);

    return (
      <>
      {game &&
      <div>
        <div className={classes.heading}>
          <Button onClick={this.handleBack}>
            <ArrowBackIcon className={classes.backButton} />
          </Button>
          <img src={game.away_team_logo} alt={game.away_team} width="75" height="75" />
          <AlternateEmailIcon className={classes.atLogo} />
          <img src={game.home_team_logo} alt={game.home_team} width="75" height="75" />
        </div>
        <div className={classes.tabPanel}>
          <TabPanel />
        </div>
      </div>}
      </>
    );
  }
}

const IndividualGameStyled = withStyles(styles)(IndividualGame);
export default connect(mapStoreToProps)(IndividualGameStyled);