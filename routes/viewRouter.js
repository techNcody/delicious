const express = require('express');
const router = express.Router();

const viewController = require('./../controllers/viewController');
const authController = require('../controllers/authController');

router.get('/', viewController.getLogin);
router.get('/home', authController.protect, viewController.getHomePage);

module.exports = router;
