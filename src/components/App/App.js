import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import TheBoard from '../TheBoard/TheBoard';
import LoginPage from '../LoginPage/LoginPage';
import CreateAccountPage from '../CreateAccountPage/CreateAccountPage';
import AddFriend from '../Friends/AddFriend'
import BottomNavBar from '../BottomNavBar/BottomNavBar'


import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_USER' });
  }

  render() {
    return (
      <Router>
        <div>
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />

            {/* Visiting localhost:3000/about will show the about page. */}

            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000the-board will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000the-board */}
            <Route
              // logged in shows UserPage else shows LoginPage
              exact
              path="/the-board"
              component={TheBoard}
            />

            {/* When a value is supplied for the authRedirect prop the user will
            be redirected to the path supplied when logged in, otherwise they will
            be taken to the component and path supplied. */}
            <Route
              // with authRedirect:
              // - if logged in, redirects to "the-board"
              // - else shows LoginPage at /login
              exact
              path="/login"
              component={LoginPage}
              authRedirect="the-board"
            />
            <ProtectedRoute
              // with authRedirect:
              // - if logged in, redirects to "the-board"
              // - else shows RegisterPage at "/registration"
              exact
              path="/create-account"
              component={CreateAccountPage}
              authRedirect="the-board"
            />
            <ProtectedRoute exactpath="/addfriends" component={AddFriend} />

            {/* If none of the other routes matched, we will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
        </div>
        {this.props.store.nav && (
        <BottomNavBar />
         )} 
      </Router>
      
    );
  }
}

export default connect(mapStoreToProps)(App);
