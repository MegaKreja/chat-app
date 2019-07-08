import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Room from '../Room/Room';
import AddRoom from '../AddRoom/AddRoom';
import './Main.css';

class Main extends Component {
  state = {
    loggedUser: {},
    roomName: '',
    addingRoom: false,
    rooms: []
  };

  componentDidMount() {
    const jwt = localStorage.getItem('jwtToken');
    console.log(jwt);
    if (!jwt) {
      this.props.history.push('/login');
    } else {
      axios
        .get('http://localhost:8000/getuser', {
          headers: { Authorization: `Bearer ${jwt}` }
        })
        .then(res => {
          this.setState({ loggedUser: res.data });
        })
        .catch(err => this.props.history.push('/login'));
      axios.get('http://localhost:8000/').then(res => {
        this.setState({ rooms: res.data.rooms });
      });
    }
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  addRoom = () => {
    const randomColor =
      'hsl(' +
      360 * Math.random() +
      ',' +
      (25 + 70 * Math.random()) +
      '%,' +
      (45 + 10 * Math.random()) +
      '%)';
    const room = {
      name: this.state.roomName,
      user: this.state.loggedUser,
      color: randomColor,
      messages: []
    };
    axios.post('http://localhost:8000/add', room).then(res => {
      this.setState({
        rooms: [...this.state.rooms, res.data.room],
        addingRoom: false
      });
    });
  };

  cancelAddingRoom = () => {
    this.setState({ addingRoom: false, roomName: '' });
  };

  openInput = () => {
    this.setState({ addingRoom: true });
  };

  onChangeRoomName = e => {
    this.setState({ roomName: e.target.value });
  };

  deleteRoom = id => {
    axios.delete('http://localhost:8000/' + id).then(res => {
      console.log(res);
    });
    const rooms = this.state.rooms.filter(room => {
      return id !== room._id;
    });
    this.setState({ rooms });
  };

  render() {
    const rooms = this.state.rooms.map((room, i) => {
      return (
        <Room
          room={room}
          deleteRoom={() => this.deleteRoom(room._id)}
          key={i}
          loggedUser={this.state.loggedUser}
        />
      );
    });

    return (
      <div className='main'>
        <Fragment>
          <div className='header'>
            <p className='welcome'>Welcome {this.state.loggedUser.username}</p>
            <Link className='changeProfile' to='/login'>
              <p>Change profile</p>
            </Link>
          </div>
          <div className='rooms'>
            {rooms}
            <AddRoom
              addingRoom={this.state.addingRoom}
              changeRoomName={this.onChangeRoomName}
              openInput={this.openInput}
              addRoom={this.addRoom}
              cancelAddingRoom={this.cancelAddingRoom}
              roomName={this.state.roomName}
            />
          </div>
        </Fragment>
      </div>
    );
  }
}

export default Main;
