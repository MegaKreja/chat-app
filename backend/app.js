const path = require('path');
const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const Room = require('./models/room');

const roomRoutes = require('./routes/room');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

// global array for displaying users connected in room
// let users = [];
// object which collects users per room
let roomUsers = {};

require('dotenv').config();

app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(authRoutes);
app.use(roomRoutes);
app.use(chatRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

io.on('connection', socket => {
  socket.on('join', data => {
    const { room, user } = data;
    socket.join(room.name);
    if (roomUsers[room.name] === undefined) {
      roomUsers[room.name] = { users: [] };
    }
    console.log(roomUsers);
    let users = roomUsers[room.name].users;
    users.push(user);
    // users = [];
    users = users.filter((x, i, a) => a.indexOf(x) === i);

    roomUsers[room.name].users = users;
    // roomUsers = {};
    console.log(roomUsers[room.name]);
    io.to(room.name).emit('join', roomUsers[room.name].users);
  });
  socket.on('leave', data => {
    const { room, user } = data;
    socket.leave(room.name);
    let users = roomUsers[room.name].users;
    users = users.filter(username => {
      return username !== user;
    });
    roomUsers[room.name].users = users;
    io.to(room.name).emit('leave', roomUsers[room.name].users);
  });
  socket.on('send message', data => {
    const { username, message, date } = data;
    const sending = {
      username,
      message,
      date
    };
    io.to(data.room.name).emit('send message', sending);
    Room.findOne({ _id: data.room._id }).then(room => {
      const messages = [...room.messages];
      messages.push({
        username: data.username,
        message: data.message,
        date: data.date
      });
      room.messages = messages;
      room.save();
    });
  });
  socket.on('user typing', data => {
    io.to(data.roomName).emit('user typing', data.username);
  });
  socket.on('user not typing', data => {
    io.to(data.roomName).emit('user not typing', data.username);
  });
});

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    server.listen(process.env.PORT || 8000);
  })
  .catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
  app.use(app.use(express.static(path.join(__dirname, '../build'))));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}
