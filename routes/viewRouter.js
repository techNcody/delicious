const express = require('express');
const router = express.Router();

const viewController = require('./../controllers/viewController');
const authController = require('../controllers/authController');

router.get('/', authController.isLoggedIn, viewController.getHomePage);
router.get('/signup', viewController.getSignup);
router.get('/login', authController.isLoggedIn, viewController.getLogin);
router.get(
  '/approveSubscription',
  authController.isLoggedIn,
  authController.restrictTo('admin'),
  viewController.approveSubscription
);
router.get(
  '/subscription',
  authController.protect,
  viewController.getSubscription
);

module.exports = router;
