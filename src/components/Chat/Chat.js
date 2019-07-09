import React, { Component } from 'react';
import axios from 'axios';
import './Chat.css';

class Chat extends Component {
  state = {
    room: {},
    loggedUser: {},
    message: '',
    messages: []
  };

  componentDidMount() {
    const jwt = localStorage.getItem('jwtToken');
    console.log(this.props.location.state);
    if (!jwt) {
      this.props.history.push('/login');
    } else {
      this.setState({ room: this.props.location.state.room });
      axios
        .get('http://localhost:8000/getuser', {
          headers: { Authorization: `Bearer ${jwt}` }
        })
        .then(res => {
          this.setState({ loggedUser: res.data });
        })
        .catch(err => this.props.history.push('/login'));
    }
  }

  render() {
    const { color, name } = this.state.room;

    return (
      <div className='chat'>
        <div className='roomName'>
          <div className='avatar inline' style={{ backgroundColor: color }} />
          <h1 className='inline roomNameHeader'>{name}</h1>
          {/* users in chat */}
        </div>
        <div className='messages'>{/* text area with chat messages */}</div>
        <div className='send'>
          <input
            type='text'
            className='inputMessage'
            placeholder='Type a message'
          />
        </div>
      </div>
    );
  }
}

export default Chat;
