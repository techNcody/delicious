const express = require('express');

// const userController = require('../controllers/userController');
// const authController = require('../controllers/authController');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.route('/createOrder').get(paymentController.createOrder);
router.route('/getOrder').post(paymentController.getOrder);
router
  .route('/fetchPaymentOnOrder')
  .post(paymentController.fetchPaymentOnOrder);
router.route('/capturePayment').get(paymentController.capturePayment);

module.exports = router;
