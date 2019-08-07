const Room = require('../models/room');

exports.getRooms = (req, res, next) => {
  Room.find({})
    .then(rooms => {
      res.status(200).json({
        rooms
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createRoom = (req, res, next) => {
  const { name, user, messages, color } = req.body;
  const newRoom = new Room({ name, user, color, messages });

  newRoom
    .save()
    .then(result => {
      res.status(200).json({
        message: 'Room created successfully!',
        room: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteRoom = (req, res, next) => {
  const { id } = req.params;
  Room.findByIdAndRemove({ _id: id })
    .then(result => {
      res.status(200).json({
        message: 'Room deleted successfully!'
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
