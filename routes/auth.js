const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/getuser', authController.getUser);
router.post('/login', authController.loginUser);

module.exports = router;
