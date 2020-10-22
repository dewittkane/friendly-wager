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
import Profile from '../Profile/Profile'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'


import './App.css';

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: '1px solid #404040',
        padding: '11px'
      },
      body: {
        color: 'white',
        backgroundColor: '#151515',
      },
      head: {
        color: 'white',
        backgroundColor: '#222222',
        paddingTop: '9px',
        paddingBottom: '9px',
      },
    },
    MuiContainer: {
      root: {
        backgroundColor: '#151515'
      },
    },
    MuiTabs: {
      root: {
        backgroundColor: '#303030',
        marginTop: '0',
        boxShadow: '0px -4px 0px #151515',
      },
    },
    MuiTypography: {
      root: {
        color: '#ffffff',
      },
      colorTextPrimary: {
        color: '#ffffff',
        backgroundColor: '#303030',
      },
    },
    MuiGrid: {
      root: {
        color: '#ffffff',
      },
    },
    MuiRadio: {
      root: {
        color: '01FF70'
      },
    },
    MuiPaper: {
      root: {
        backgroundColor: "#151515"
      },
    },
    MuiFormGroup: {
      root: {
        display: 'block'
      },
    },
    MuiDialogTitle: {
      root: {
        backgroundColor: '#303030',
      },
    },
    MuiDialogActions: {
      root: {
        backgroundColor: '#303030',
      },
    },
    MuiDialogContent: {
      root: {
        backgroundColor: '#303030',
      },
    },
    MuiDialogContentText: {
      root: {
        color: '#ffffff',
      },
    },
    MuiButton: {
      root: {
        backgroundColor: '#303030',
        color: '#ffffff',
      },
    },
  },
  palette: {
    primary: {
      main: '#303030',
    },
    secondary: {
      main: '#01FF70',
    },
    textPrimary: {
      main: '#ffffff',
    },
  },
});

class App extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_USER' });
    const currentWeek = convertDate();
    this.props.dispatch({ type: 'FETCH_GAMES', payload: currentWeek });
    this.props.dispatch({ type: 'FETCH_BETS' })
    if (!this.props.store.friendsList.length) {
      this.props.dispatch({ type: 'GET_FRIENDS'})
    }
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
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
                exact
                path='/profile/:id'
                component={Profile}
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
          {/* conditionally renders the bottom navbar to not show up on login or registration */}
          {this.props.store.nav && (
            <BottomNavBar />
          )}
        </Router>
      </ThemeProvider>

    );
  }
}

export default connect(mapStoreToProps)(App);
