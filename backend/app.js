const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const roomRoutes = require('./routes/room');
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();

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

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.DB)
  .then(result => {
    app.listen(process.env.PORT);
  })
  .catch(err => console.log(err));
