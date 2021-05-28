// const localStorage = require('localStorage');

// const catchAsync = require('../utils/catchAsync');
// const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.getHomePage = (req, res, next) => {
  let userName = null;
  if (req.user) {
    userName = req.user.name;
  }
  res.status(200).render('home', {
    title: 'feellikehome | Home',
    userName
  });
};

exports.getLogin = (req, res, next) => {
  let userName = null;
  if (req.user) {
    userName = req.user.name;
    res.status(200).render('home', {
      title: 'feellikehome | Home',
      userName
    });
  } else {
    res.status(200).render('login', {
      title: 'feellikehome | Login'
    });
  }
};

exports.getSubscription = (req, res, next) => {
  res.status(200).render('subscription', {
    title: 'feellikehome | subscription'
  });
};

exports.getSignup = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'feellikehome | signup'
  });
};
