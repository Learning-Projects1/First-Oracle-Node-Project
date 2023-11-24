// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const endPoints = require('../utils/endPoints');

const router = express.Router();

// router.post(endPoints.signup, authController.signup);
// router.post(endPoints.login, authController.login);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;
