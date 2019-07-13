import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

class Chat extends Component {
  state = {
    room: {},
    loggedUser: {},
    message: '',
    messages: []
  };

  componentDidUpdate() {
    console.log(this.state);
  }

  componentDidMount() {
    const socket = io.connect('http://localhost:8000');
    const jwt = localStorage.getItem('jwtToken');
    console.log(this.props.location.state);
    if (!jwt) {
      this.props.history.push('/login');
    } else {
      this.setState({ room: this.props.location.state.room });
      socket.on('send message', message => {
        this.setState({
          message: '',
          messages: [...this.state.messages, message]
        });
      });
      axios
        .get(
          `http://localhost:8000/messages/${this.props.location.state.room._id}`
        )
        .then(res => {
          console.log(res.data);
          this.setState({ messages: res.data.messages });
        });
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

  handleSendMessage = event => {
    const socket = io.connect('http://localhost:8000');
    const { username } = this.state.loggedUser;
    const sending = {
      username,
      message: event.target.value,
      date: new Date().toLocaleString('en-GB'),
      room: this.state.room
    };
    if (event.key === 'Enter') {
      socket.emit('send message', sending);
    }
  };

  onChangeMessageInput = e => {
    this.setState({ message: e.target.value });
  };

  render() {
    const { color, name } = this.state.room;
    const messages = this.state.messages.map((msg, i) => {
      return (
        <div key={i}>
          <p>{msg.date}</p>
          <p>{msg.username}</p>
          <h2>{msg.message}</h2>
        </div>
      );
    });

    return (
      <div className='chat'>
        <div className='roomName'>
          <div className='avatar inline' style={{ backgroundColor: color }} />
          <h1 className='inline roomNameHeader'>{name}</h1>
          {/* users in chat */}
        </div>
        {/* text area component with messages dole */}
        <div className='messages'>{messages}</div>
        <div className='send'>
          <input
            type='text'
            className='inputMessage'
            placeholder='Type a message'
            onChange={this.onChangeMessageInput}
            onKeyPress={this.handleSendMessage}
            value={this.state.message}
          />
        </div>
      </div>
    );
  }
}

export default Chat;
