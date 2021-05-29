// const localStorage = require('localStorage');

// const catchAsync = require('../utils/catchAsync');
// const Product = require('../models/productModel');
const User = require('../models/userModel');
const Request = require('../models/requestModel');
const Subscription = require('../models/subscriptionModel');

exports.getHomePage = async (req, res, next) => {
  let userName = null;
  let role = null;
  let request = null;
  let requestStatus = null;
  let subscription = null;
  let subscriptionStatus = null;
  let amount = 0;
  if (req.user) {
    role = req.user.role;
    userName = req.user.name;
    request = await Request.findOne({
      userCustomerEmail: req.user.email
    });
    // console.log(request);
    if (request) {
      requestStatus = request.status;
      subscription = await Subscription.findOne({
        requestId: request._id
      });
    }
    if (subscription) {
      subscriptionStatus = subscription.status;
    }
    // console.log(request);
  }

  if (request) {
    if (request.mealType === 'non-veg') {
      amount = 2100;
    } else if (request.mealType === 'veg') {
      amount = 1800;
    }
  }

  res.status(200).render('home', {
    title: 'feellikehome | Home',
    userName,
    role,
    request,
    amount,
    subscriptionStatus,
    requestStatus
  });
};

exports.getLogin = (req, res, next) => {
  let userName = null;
  let role = null;
  if (req.user) {
    role = req.user.role;
  }
  // console.log(role);
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
  // const customers = await User.find({ role: 'customer' });
  const vendors = await User.find({ role: 'vendor' });
  const requests = await Request.find({ status: 'pending' });
  res.status(200).render('approveSubscription', {
    title: 'feellikehome | Approve Subscription',
    // customers,
    vendors,
    requests
  });
};
