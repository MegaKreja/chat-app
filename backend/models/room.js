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
  messages: [Object]
});

module.exports = mongoose.model('Room', roomSchema);
