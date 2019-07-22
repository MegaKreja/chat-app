const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Room = require('./models/room');

const roomRoutes = require('./routes/room');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

// global array for displaying users connected in room
let users = [];

require('dotenv').config();

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
    socket.join(data.room.name);
    console.log(data.user);
    users.push(data.user);
    // users = [];
    console.log(users);
    users = users.filter((x, i, a) => a.indexOf(x) === i);
    io.to(data.room.name).emit('join', users);

    console.log(users);
  });
  socket.on('leave', data => {
    socket.leave(data.room.name);
    users = users.filter(user => {
      return user !== data.user;
    });
    io.to(data.room.name).emit('leave', users);
  });
  socket.on('send message', data => {
    console.log(`${data.username}: ${data.message}`);
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
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(result => {
    server.listen(process.env.PORT);
  })
  .catch(err => console.log(err));
