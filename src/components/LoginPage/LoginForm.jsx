import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import {Typography} from '@material-ui/core'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
  };

  login = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: 'LOGIN',
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

  handleInputChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  render() {
    return (
     
      <form className="formPanel" onSubmit={this.login}>
         <center>
        <h2>Login</h2>
        {this.props.store.errors.loginMessage && (
          <h3 className="alert" role="alert">
            {this.props.store.errors.loginMessage}
          </h3>
        
        )}
        </center>
        <div>
          <center>
          <label htmlFor="username">
            Email:
            <input
              type="text"
              name="username"
              required
              value={this.state.username}
              onChange={this.handleInputChangeFor('username')}
            />
          </label>
          </center>
        </div>
        <div>
         <center>
          <label htmlFor="password">
            Password:
            <input
              type="password"
              name="password"
              required
              value={this.state.password}
              onChange={this.handleInputChangeFor('password')}
            />
          </label>
          </center>
        
        </div>
        <center>
        <div>
          <input className="btn" type="submit" name="submit" value="Log In" />
        </div>
        </center>
      </form>
    );
  }
}

export default connect(mapStoreToProps)(LoginForm);
