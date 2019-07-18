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
  // io.clients((error, clients) => {
  //   if (error) throw error;
  //   // console.log(clients);
  //   socket.on('send user', data => {
  //     const users = [];
  //     users.push(data);
  //     // console.log(data);
  //     io.emit('send user', data);
  //   });
  // });
  socket.on('send message', data => {
    console.log(`${data.username}: ${data.message}`);
    const { username, message, date } = data;
    const sending = {
      username,
      message,
      date
    };
    io.emit('send message', sending);
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
    io.emit('user typing', data);
  });
  socket.on('user not typing', data => {
    io.emit('user not typing', data);
  });
});

mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(result => {
    server.listen(process.env.PORT);
  })
  .catch(err => console.log(err));
