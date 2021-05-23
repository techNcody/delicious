const express = require('express');
const router = express.Router();

const viewController = require('./../controllers/viewController');
const authController = require('../controllers/authController');

router.get('/', authController.isLoggedIn, viewController.getHomePage);
router.get('/login', authController.isLoggedIn, viewController.getLogin);
router.get(
  '/subscription',
  authController.protect,
  viewController.getSubscription
);

module.exports = router;
