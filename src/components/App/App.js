import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import convertDate from '../../components/TheBoard/check-week';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import TheBoard from '../TheBoard/TheBoard';
import LoginPage from '../LoginPage/LoginPage';
import CreateAccountPage from '../CreateAccountPage/CreateAccountPage';
import AddFriend from '../Friends/AddFriend';
import BottomNavBar from '../BottomNavBar/BottomNavBar';
import IndividualGame from '../IndividualGame/IndividualGame';
import FriendsList from '../Friends/FriendsList'
import FriendStatistics from '../Friends/FriendStatistics'
import MyBets from '../MyBets/MyBets'
import { ThemeProvider, createMuiTheme} from '@material-ui/core/styles'


import './App.css';

const darkTheme = createMuiTheme ({
  palette: {
    type: "dark"
  }
})

class App extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_USER' });
    const currentWeek = convertDate();
    this.props.dispatch({ type: 'FETCH_GAMES', payload: currentWeek });
    this.props.dispatch({ type: 'FETCH_BETS' })
  }

  render() {
    return (
      <ThemeProvider theme={darkTheme}>
      <Router>
        <div>
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/login */}
            <Redirect exact from="/" to="/login" />

            {/* When a value is supplied for the authRedirect prop the user will
            be redirected to the path supplied when logged in, otherwise they will
            be taken to the component and path supplied. */}
            <ProtectedRoute
              // with authRedirect:
              // - if logged in, redirects to "the-board"
              // - else shows LoginPage at /login
              exact
              path="/login"
              component={LoginPage}
              authRedirect="/the-board"
            />
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000the-board will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000the-board */}
            <ProtectedRoute
              exact
              path="/the-board"
              component={TheBoard}
            />



            <ProtectedRoute
              exact
              path='/game-details/:id'
              component={IndividualGame}
            />

            <ProtectedRoute
              // with authRedirect:
              // - if logged in, redirects to "the-board"
              // - else shows CreateAccountPage at "/create-account"
              exact
              path="/create-account"
              component={CreateAccountPage}
              authRedirect="/the-board"
            />

            {/* <ProtectedRoute
              // with authRedirect:
              // - if logged in, redirects to "the-board"
              // - else shows RegisterPage at "/registration"
              exact
              path="/create-account"
              component={FriendsList}
              authRedirect="/friends"
            /> */}

            <ProtectedRoute 
              exact 
              path="/friends" 
              component={FriendsList} 
            />

            <ProtectedRoute 
              exact 
              path="/friends/add" 
              component={AddFriend} 
             />

            <ProtectedRoute 
              exact 
              path='/friends/statistics/:id'
              component={FriendStatistics} 
            />

            <ProtectedRoute
              exact 
              path='/mybets' 
              component={MyBets}
            />

            

            {/* If none of the other routes matched, we will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
        </div>
        {this.props.store.nav && (
        <BottomNavBar />
         )} 
      </Router>
      </ThemeProvider>
      
    );
  }
}

export default connect(mapStoreToProps)(App);
