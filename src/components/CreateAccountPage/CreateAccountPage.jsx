import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import RegisterForm from './RegisterForm';
import { withStyles} from '@material-ui/core';

const styles = theme => ({

});

class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
  };

  componentDidMount(){
    this.props.dispatch({type: 'TOGGLE_NAV'});
  }
  componentWillUnmount(){
    this.props.dispatch({type: 'TOGGLE_NAV'})
  }
  

  render() {

    const { classes } = this.props;

    return (
      <div>
        <center>
        <br/>
        <br/>
        <br/>
        <RegisterForm />
        </center>
      </div>
    );
  }
}

const RegisterPageStyled = withStyles(styles)(RegisterPage);
export default connect(mapStoreToProps)(RegisterPageStyled);
