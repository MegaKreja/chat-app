const Room = require('../models/room');

exports.getMessages = (req, res, next) => {
  const { roomId } = req.params;
  Room.findOne({ _id: roomId })
    .then(room => {
      res.status(200).json({ messages: room.messages });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.sendMessage = (req, res, next) => {};
