import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import TabPanel from './TabPanel';
import { Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// Basic class component structure for React with default state
// value setup. When making a new component be sure to replace
// the component name IndividualGame with the name for the new
// component.
class IndividualGame extends Component {

  componentDidMount() {
    this.props.dispatch({type: 'FETCH_GAME_DETAILS', payload: this.props.match.params.id })
  }

  handleBack = () => {
    this.props.history.goBack();
  }

  render() {

    const game = this.props.store.gameDetails;
    console.log(game);

    return (
      <div>
        <Button onClick={this.handleBack}>
          <ArrowBackIcon />
        </Button>
        <h2>{game.away_team} @ {game.home_team}</h2>
        {/* {JSON.stringify(this.props.store.gameDetails)} */}
        <TabPanel />
      </div>
    );
  }
}

export default connect(mapStoreToProps)(IndividualGame);