import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import { withStyles, Typography, TextField, Button } from '@material-ui/core';

const styles = theme => ({
  textField: {
    backgroundColor: 'white',
    borderRadius: '.5em',
    margin: '.3em',
    width: '15em',
  },
  mainGrid: {
    marginTop: '2em',
  },
  registerBtn: {
    marginTop: '1.5em',
    width: '140px',
  },
  cancelBtn: {
    marginTop: '1em',
    width: '140px',
  },
});

function emailValidation(email) {
  let emailIsValid = false;
  for (let i = 0; i < email.length; i++) {
    if (email[i] === '@') {
      emailIsValid = true;
    }
  }
  return emailIsValid;
}

class RegisterForm extends Component {
  state = {
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  registerUser = (event) => {
    event.preventDefault();
    //check email will be returned as false if no @ symbol in username
    let checkEmail = emailValidation(this.state.username);
    if ((this.state.password === this.state.confirmPassword) && checkEmail) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          username: this.state.username,
          password: this.state.password,
        },
      })
    }
    else if (!checkEmail) {
      this.props.dispatch({ type: 'EMAIL_IS_INVALID' })
    }
    else {
      this.props.dispatch({ type: 'CONFIRM_PASSWORD_ERROR' });
    }
  }; // end registerUser

  handleInputChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  };

  render() {

    const { classes } = this.props

    return (
      <form onSubmit={this.registerUser}>
        <Typography style={{ color: 'white' }} variant="h4">Register Account</Typography>
        {this.props.store.errors.registrationMessage && (
          <h3 className="alert" role="alert">
            {this.props.store.errors.registrationMessage}
          </h3>
        )}
        <Grid container spacing={1} className={classes.mainGrid}>
          <Grid item xs={12}>
            <label htmlFor="first_name">
              <TextField
                color="secondary"
                placeholder="first name"
                size="small"
                className={classes.textField}
                variant="outlined"
                type="text"
                name="first_name"
                value={this.state.first_name}
                required
                onChange={this.handleInputChangeFor('first_name')}
              />
            </label>
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="last_name">
              <TextField
                color="secondary"
                placeholder="last name"
                size="small"
                className={classes.textField}
                variant="outlined"
                type="text"
                name="last_name"
                value={this.state.last_name}
                required
                onChange={this.handleInputChangeFor('last_name')}
              />
            </label>
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="username">
              <TextField
                color="secondary"
                placeholder="email"
                size="small"
                className={classes.textField}
                variant="outlined"
                type="text"
                name="username"
                value={this.state.username}
                required
                onChange={this.handleInputChangeFor('username')}
              />
            </label>
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="password">
              <TextField
                color="secondary"
                placeholder="password"
                size="small"
                className={classes.textField}
                variant="outlined"
                type="password"
                name="password"
                value={this.state.password}
                required
                onChange={this.handleInputChangeFor('password')}
              />
            </label>
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="password">
              <TextField
                color="secondary"
                placeholder="confirm password"
                size="small"
                className={classes.textField}
                variant="outlined"
                type="password"
                name="password"
                value={this.state.confirmPassword}
                required
                onChange={this.handleInputChangeFor('confirmPassword')}
              />
            </label>
          </Grid>

        </Grid>
        <div>
          <Button
            className={classes.registerBtn}
            variant="contained"
            color="primary"
            type="submit"
            name="submit"
            value="Register">
            Register
          </Button>
        </div>
        <div>
          <Button
            color="primary"
            className={classes.cancelBtn}
            variant="contained"
            type="button"
            onClick={() => {
              this.props.history.push('/login');
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }
}

const RegisterFormStyled = withStyles(styles)(RegisterForm);
export default connect(mapStoreToProps)(withRouter(RegisterFormStyled));
