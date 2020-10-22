import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

// CUSTOM COMPONENTS
import RegisterForm from './RegisterForm';

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
    return (
      <div>
        <RegisterForm />

        <center>
          <button
            type="button"
            className="btn btn_asLink"
            onClick={() => {
              this.props.history.push('/login');
            }}
          >
            Login
          </button>
        </center>
      </div>
    );
  }
}

export default connect(mapStoreToProps)(RegisterPage);
