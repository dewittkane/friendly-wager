import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import LoginForm from './LoginForm';
import BottomNavBar from '../BottomNavBar/BottomNavBar'


class LoginPage extends Component {
  componentDidMount(){
    this.props.dispatch({type: 'TOGGLE_NAV'});
  }
  componentWillUnmount(){
    this.props.dispatch({type: 'TOGGLE_NAV'})
  }
  render() {
    
    return (
      <div>
        <LoginForm />

        <center>
          <button
            type="button"
            className="btn btn_asLink"
            onClick={() => {
              this.props.history.push('/create-account');
            }}
          >
            Register
          </button>
        </center>
      </div>
    );
  }
}

export default connect(mapStoreToProps)(LoginPage);
