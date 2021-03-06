const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/login').post(authController.login);
router.route('/sendOtp').post(authController.sendOtp);
router.route('/logout').get(authController.logout);

router.route('/signup').post(authController.signUp);
router.route('/protect').get(authController.protect);
router.route('/sendMessage').post(authController.sendMessage);
router.route('/approveSubscription').post(authController.approveSubscription);
router
  .route('/sendSubscriptionReq')
  .post(authController.protect, authController.sendSubscriptionReq);

// router
//   .route('/updateUser')
//   .post(authController.protect, userController.updateUser);

router.route('/me').get(authController.protect, userController.getMe);

router.route('/:id').post(
  authController.protect,
  // authController.restrictTo('admin', 'guide', 'lead-guide'),
  userController.getUser
);

router.route('/').get(
  // authController.protect,
  // authController.restrictTo('admin'),
  userController.getUsers
);

module.exports = router;
