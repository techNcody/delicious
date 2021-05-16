// const localStorage = require('localStorage');

// const catchAsync = require('../utils/catchAsync');
// const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.getHomePage = (req, res, next) => {
  const userName = req.user.name;
  res.status(200).render('home', {
    title: 'feellikehome | Home',
    userName
  });
};

exports.getLogin = (req, res, next) => {
  res.status(200).render('login', {
    title: 'feellikehome | Login'
  });
};
