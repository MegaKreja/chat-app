const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: Object,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  messages: []
});

module.exports = mongoose.model('Room', roomSchema);
