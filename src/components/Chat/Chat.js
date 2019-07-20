import React, { Component } from 'react';
import ChatMessages from '../ChatMessages/ChatMessages';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

const socket = io.connect('http://localhost:8000');

class Chat extends Component {
  state = {
    room: {},
    loggedUser: {},
    users: [],
    message: '',
    typing: [],
    messages: []
  };

  componentDidUpdate() {
    console.log(this.state);
  }

  componentDidMount() {
    const jwt = localStorage.getItem('jwtToken');
    console.log(this.props.match.params.id);
    if (!jwt) {
      this.props.history.push('/login');
    } else {
      this.setState({ room: this.props.location.state.room }, () => {
        socket.emit('join', this.state.room.name);
        this.getUser(jwt);
        this.userIsTyping();
        this.userNotTyping();
        this.socketSendMessage(socket);
        this.getMessages();
      });
    }
  }

  componentWillUnmount() {
    socket.emit('leave', this.state.room.name);
  }
  // Try to get all users in a room
  // getUsersInRoom = () => {
  //   const username = this.state.loggedUser;
  //   socket.emit('send user', username);
  //   socket.on('send user', users => {
  //     console.log(users);
  //   });
  // };

  userIsTyping = () => {
    let typing = this.state.typing.slice();
    socket.on('user typing', user => {
      if (this.state.loggedUser.username !== user) {
        typing.push(user);
        typing = typing.filter((x, i, a) => a.indexOf(x) === i);
        console.log(typing);
        this.setState({ typing });
      }
    });
  };

  userNotTyping = () => {
    let typing = this.state.typing.slice();
    socket.on('user not typing', user => {
      typing.filter(typingUser => {
        return user === typingUser;
      });
      this.setState({ typing });
    });
  };

  socketSendMessage = socket => {
    const typingInfo = {
      username: this.state.loggedUser.username,
      roomName: this.state.room.name
    };
    socket.on('send message', message => {
      socket.emit('user not typing', typingInfo);
      this.setState({
        message: '',
        messages: [...this.state.messages, message]
      });
      const list = document.getElementById('list');
      list.scrollTop = list.scrollHeight;
    });
  };

  getUser = jwt => {
    axios
      .get('http://localhost:8000/getuser', {
        headers: { Authorization: `Bearer ${jwt}` }
      })
      .then(res => {
        this.setState({ loggedUser: res.data });
        // this.getUsersInRoom();
      })
      .catch(err => this.props.history.push('/login'));
  };

  getMessages = () => {
    axios
      .get(`http://localhost:8000/chat/${this.props.match.params.id}`)
      .then(res => {
        this.setState({ messages: res.data.messages });
        const list = document.getElementById('list');
        list.scrollTop = list.scrollHeight;
      })
      .catch(err => this.props.history.push('/'));
  };

  handleSendMessage = event => {
    const { username } = this.state.loggedUser;
    const sending = {
      username,
      message: event.target.value,
      date: new Date().toLocaleString('en-GB'),
      room: this.state.room
    };
    if (event.key === 'Enter') {
      socket.emit('send message', sending);
      this.setState({ typing: '' });
    }
  };

  onChangeMessageInput = e => {
    const typingInfo = {
      username: this.state.loggedUser.username,
      roomName: this.state.room.name
    };
    this.setState({ message: e.target.value }, () => {
      if (this.state.message !== '') {
        socket.emit('user typing', typingInfo);
      } else {
        socket.emit('user not typing', typingInfo);
      }
    });
  };

  render() {
    const { color, name } = this.state.room;

    return (
      <div className='chat'>
        <div className='roomName'>
          <div className='avatar inline' style={{ backgroundColor: color }} />
          <h1 className='inline roomNameHeader'>{name}</h1>
          {/* users in chat */}
        </div>
        <ChatMessages
          messages={this.state.messages}
          username={this.state.loggedUser.username}
          typing={this.state.typing}
        />
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
