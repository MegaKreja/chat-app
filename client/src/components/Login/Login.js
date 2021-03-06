import React, { Component } from 'react';
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';
import './Login.css';

let host = window.location.hostname;
let protocol = window.location.protocol;
let baseUrl = null;
if (host === 'localhost') {
  baseUrl = protocol + '//' + host + ':8000';
} else {
  baseUrl = protocol + '//' + host;
}

class Login extends Component {
  state = {
    username: ''
  };

  loginUser = () => {
    const user = {
      username: this.state.username
    };
    if (this.state.username !== '') {
      axios
        .post(`${baseUrl}/login`, user)
        .then(res => {
          const token = res.data.token;
          localStorage.setItem('jwtToken', token);
          this.props.history.push('/');
        })
        .catch(err => this.props.history.push('/login'));
    }
  };

  loginUserKeyPress = event => {
    if (event.key === 'Enter') {
      this.loginUser();
    }
  };

  onChangeLoggedUser = e => {
    this.setState({ username: e.target.value });
  };

  render() {
    return (
      <div className='login'>
        <h1>Login or register</h1>
        <input
          className='loginInput'
          type='text'
          onChange={this.onChangeLoggedUser}
          onKeyPress={this.loginUserKeyPress}
          autoFocus
        />
        <div className='btnLogin' onClick={this.loginUser}>
          <FaCheck />
        </div>
      </div>
    );
  }
}

export default Login;
