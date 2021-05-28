// const localStorage = require('localStorage');

// const catchAsync = require('../utils/catchAsync');
// const Product = require('../models/productModel');
const User = require('../models/userModel');
const Request = require('../models/requestModel');

exports.getHomePage = (req, res, next) => {
  let userName = null;
  let role = null;
  if (req.user) {
    role = req.user.role;
  }
  console.log(role);
  if (req.user) {
    userName = req.user.name;
  }
  res.status(200).render('home', {
    title: 'feellikehome | Home',
    userName,
    role
  });
};

exports.getLogin = (req, res, next) => {
  let userName = null;
  let role = null;
  if (req.user) {
    role = req.user.role;
  }
  console.log(role);
  if (req.user) {
    userName = req.user.name;
    res.status(200).render('home', {
      title: 'feellikehome | Home',
      userName,
      role
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
exports.approveSubscription = async (req, res, next) => {
  const customers = await User.find({ role: 'customer' });
  const vendors = await User.find({ role: 'vendor' });
  const requests = await Request.find();
  res.status(200).render('approveSubscription', {
    title: 'feellikehome | Approve Subscription',
    customers,
    vendors,
    requests
  });
};
