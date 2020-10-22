import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { withRouter } from 'react-router-dom';
import { withStyles, Typography, TextField, Button } from '@material-ui/core'

const styles = theme => ({
  textField: {
    backgroundColor: 'white',
    borderRadius: '.5em',
    margin: '.3em',
    width: '15em',
    marginTop: '.7em',
  },
  loginBtn: {
    marginTop: '1.5em',
    marginBottom: '1em',
    width: '140px',
  },
  registerBtn: {
    width: '140px',
  },
});



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
      this.props.history.push('/the-board')
    } 
    else {
      this.props.dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

  handleInputChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  render() {

    const { classes } = this.props;

    return (

      <form onSubmit={this.login}>
        <center>
          {this.props.store.errors.loginMessage && (
            <h3 className="alert" role="alert">
              {this.props.store.errors.loginMessage}
            </h3>

          )}
        </center>
        <div>
          <center>
            <label htmlFor="username">
              <TextField
                size="small"
                className={classes.textField}
                type="text"
                placeholder="email"
                name="username"
                variant="outlined"
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
              <TextField
                className={classes.textField}
                placeholder="password"
                size="small"
                type="password"
                name="password"
                variant="outlined"
                required
                value={this.state.password}
                onChange={this.handleInputChangeFor('password')}
              />
            </label>
          </center>
        </div>
        <center>
          <div>
            <Button
              className={classes.loginBtn}
              color="primary"
              variant="contained"
              type="submit"
              name="submit"
              value="Log In">
              Log In
            </Button>
            <div>
              <Button
                className={classes.registerBtn}
                variant="contained"
                color="primary"
                onClick={() => {
                  this.props.history.push('/create-account');
                }}
                >
                Register
              </Button>
            </div>
          </div>
        </center>
      </form>
    );
  }
}

const LoginFormStyled = withStyles(styles)(LoginForm);
export default connect(mapStoreToProps)(withRouter(LoginFormStyled));
