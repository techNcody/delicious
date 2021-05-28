const { promisify } = require('util');
const pug = require('pug');
const path = require('path');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const localStorage = require('localStorage');
const nodemailer = require('nodemailer');
const Email = require('email-templates');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const sendMailHTML = function (toAddress, subject, html) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.NODEMAILER_USERNAME,
    to: toAddress,
    subject,
    html
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const sendMail = function (toAddress, subject, text) {
  // console.log(process.env.NODEMAILER_USERNAME);
  // console.log(process.env.NODEMAILER_PASSWORD);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.NODEMAILER_USERNAME,
    to: toAddress,
    subject,
    text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

exports.signUp = async (req, res, next) => {
  try {
    console.log(req.body);
    let role, aadhaarNumber, companyName, GSTIN, mobileNumber, pincode;
    mobileNumber = parseInt(req.body.mobile);
    pincode = parseInt(req.body.pinCode);
    if (req.body.role) role = req.body.role;
    if (req.body.aadhaarNumber)
      aadhaarNumber = parseInt(req.body.aadhaarNumber);
    if (req.body.companyName) companyName = req.body.companyName;
    if (req.body.GSTIN) GSTIN = req.body.GSTIN;
    // console.log(pincode);
    // console.log()
    // console.log()

    const newUser = await User.create({
      name: req.body.name,
      mobileNumber,
      email: req.body.email,
      role,
      address: [
        {
          addressLine1: req.body.addressLine1,
          addressLine2: req.body.addressLine2,
          addressLine3: req.body.addressLine3,
          pincode,
          landmark: req.body.landmark,
          locality: req.body.locality
        }
      ],
      aadhaarNumber,
      companyName,
      GSTIN
    });

    // if (password !== passwordConfirm) {
    //   return res.status(400).json({
    //     data: {
    //       status: 'fail',
    //       msg: 'Please confirm your password again'
    //     }
    //   });
    // }

    const token = await jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({
      data: {
        status: 'success',
        token
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      data: {
        status: 'fail',
        msg: err.message
      }
    });
  }
};

exports.sendOtp = async (req, res, next) => {
  const { email } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000);

  // 1) Update OTP in user data
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      data: {
        status: 'error'
      }
    });
  }

  const newUser = await User.findByIdAndUpdate(user.id, { otp });
  // req.user = newUser;

  // 2) Send OTP through SMS / email
  const text = `Hi ${user.name}, ${otp} is your OTP for logging in to delicious Platform. This OTP will be valid only for the next 10 minutes.`;
  const subject = 'Login OTP';
  sendMail(user.email, subject, text);
  res.status(200).json({
    data: {
      status: 'success',
      msg: 'OTP sent to your registered email address'
    }
  });
};

exports.login = catchAsync(async (req, res, next) => {
  try {
    const { otp, userState } = req.body;

    if (!otp) return next(new AppError('Please provide a valid OTP', 400));

    const user = await User.findOne({ otp });

    if (!user) {
      return res.status(404).json({
        data: {
          status: 'fail',
          msg: 'Invalid OTP, Please try again!'
        }
      });
    }

    // console.log(user);
    if (user.email === userState) {
      req.user = user;
    } else {
      return next(new AppError('This OTP does not belong to the user', 400));
    }

    const id = user.id;
    const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    // if (token) console.log(token);

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };

    res.cookie('jwt', token, cookieOptions);

    localStorage.setItem('userName', user.name);
    // console.log(localStorage.getItem('userName'));
    const newOtp = Math.floor(1000 + Math.random() * 9000);
    const newUser = await User.findByIdAndUpdate(user.id, { otp: newOtp });
    user.otp = undefined;
    // console.log(req.user);

    return res.status(200).json({
      data: {
        status: 'success',
        token,
        data: {
          user
        }
      }
    });
  } catch (err) {
    // console.log(err);
    return res.status(400).json({
      data: {
        err
      }
    });
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError(
        'You are not authorised to access this route, please login again.',
        401
      )
    );

  // const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(
      new AppError(
        'The user belonging to the token is nolonger exists, please login again',
        401
      )
    );

  req.user = currentUser;
  // console.log(token);
  // console.log(currentUser);
  // console.log('Hello from the auth');
  // if (currentUser) {
  //   res.status(200).json({
  //     status: 'successss'
  //   });
  // } else {
  //   res.status(404).json({
  //     status: 'error'
  //   });
  // }
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'Logged out') return next();

  // const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  const currentUser = await User.findById(decoded.id);

  if (currentUser) req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not authorised to access this route', 403)
      );
    }
    next();
  };
};

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'Logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  localStorage.removeItem('userName');

  res.status(200).json({
    status: 'success'
  });
});

exports.sendMessage = (req, res, next) => {
  console.log(req.body);

  const toAddress = 'contact.speksolutions@gmail.com';
  const subject = `New message from ${req.user.name.split(' ')[0]} (${
    req.body.email
  })`;

  const html = pug.renderFile(`${__dirname}/../views/emailTemplate.pug`, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
    subject
  });

  sendMailHTML(toAddress, subject, html);
  res.status(200).json({
    status: 'success'
  });
};

exports.sendSubscriptionReq = (req, res, next) => {
  console.log(req.body);
  console.log(req.user);

  const toAddress = 'contact.speksolutions@gmail.com';
  const subject = `Subscription request from ${req.user.name.split(' ')[0]} (${
    req.body.contactPersonMob
  })`;

  const html = pug.renderFile(
    `${__dirname}/../views/subscriptionTemplate.pug`,
    {
      mealType: req.body.mealType,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      addressLine3: req.body.addressLine3,
      pinCode: req.body.pinCode,
      landMark: req.body.landMark,
      locality: req.body.locality,
      contactPerson: req.body.contactPerson,
      contactPersonMob: req.body.contactPersonMob,
      message: req.body.message
    }
  );

  sendMailHTML(toAddress, subject, html);
  res.status(200).json({
    status: 'success'
  });
};

// $('.php-email-form').find('.sent-message').slideDown();
// S.fn.init [div.sent-message, prevObject: S.fn.init(1)]
// $('.php-email-form').find('.sent-message').slideUp();
// S.fn.init [div.sent-message, prevObject: S.fn.init(1)]
// maps.google.com/maps/gen_204?target=api&ev=api_snap&cad=host:www.google.com,v:44,r:100,client:google-maps-embed,t:9-515037,Mm-p:1-if,Mm-h:1-if,Ox-p:1-if,Ox-h:1-if,Rs-p:1-if,Rs-h:1-if,src:apiv3,token:82o4rrmdzl,ts:1969j6:1 GET https://maps.google.com/maps/gen_204?target=api&ev=api_snap&cad=host:www.google.com,v:44,r:100,client:google-maps-embed,t:9-515037,Mm-p:1-if,Mm-h:1-if,Ox-p:1-if,Ox-h:1-if,Rs-p:1-if,Rs-h:1-if,src:apiv3,token:82o4rrmdzl,ts:1969j6 net::ERR_NAME_NOT_RESOLVED
// Image (async)
// eY.Rf @ stats.js:4
// Bja @ stats.js:3
// (anonymous) @ stats.js:3
// $('.php-email-form').find('.loading').slideUp();
// S.fn.init [div.loading, prevObject: S.fn.init(1)]
