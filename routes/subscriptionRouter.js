const express = require('express');

// const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
// const paymentController = require('../controllers/paymentController');
const subscriptionController = require('../controllers/subscriptionController');

const router = express.Router();

router
  .route('/createSubscription')
  .post(subscriptionController.createSubscription);

module.exports = router;
