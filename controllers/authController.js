const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.loginUser = (req, res, next) => {
  const username = req.body.username;
  console.log(username);
  User.findOne({ username })
    .then(user => {
      if (!user) {
        const newUser = new User({ username });
        newUser.save().then(result => {
          const token = jwt.sign(
            {
              _id: result._id.toString(),
              username: result.username
            },
            process.env.SECRET,
            {
              expiresIn: '6h'
            }
          );
          res
            .status(200)
            .json({ message: 'User created!', token: token, user: result });
        });
      } else {
        const token = jwt.sign(
          {
            _id: user._id.toString(),
            username: user.username
          },
          process.env.SECRET,
          {
            expiresIn: '6h'
          }
        );
        res.status(200).json({
          token: token,
          user: { _id: user._id.toString(), username: user.username }
        });
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUser = (req, res) => {
  const usertoken = req.headers.authorization;
  const token = usertoken.split(' ');
  jwt.verify(token[1], process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(200).json({ expired: true });
    }
    return res
      .status(200)
      .json({ _id: decoded._id, username: decoded.username });
  });
  // const decoded = jwt.verify(token[1], process.env.SECRET);
  // console.log(decoded);
  // res.status(200).json({ _id: decoded._id, username: decoded.username });
};
