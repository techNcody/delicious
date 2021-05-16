const { promisify } = require('util');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const localStorage = require('localStorage');
const nodemailer = require('nodemailer');

const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const sendMail = function (toAddress, text) {
  console.log(process.env.NODEMAILER_USERNAME);
  console.log(process.env.NODEMAILER_PASSWORD);
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
    subject: 'Login OTP',
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
    const newUser = await User.create({
      name: req.body.name,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      role: req.body.role
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
    // console.log(err);
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

  const newUser = await User.findByIdAndUpdate(user.id, { otp });
  // req.user = newUser;

  // 2) Send OTP through SMS / email
  const text = `Hi ${user.name}, ${otp} is your OTP for logging in to delicious Platform. This OTP will be valid only for the next 10 minutes.`;
  sendMail(user.email, text);
  res.status(200).json({
    data: {
      status: 'success',
      msg: 'OTP sent to your registered email address'
    }
  });
};

exports.login = catchAsync(async (req, res, next) => {
  try {
    const { otp } = req.body;
    console.log(otp);
    console.log(typeof otp);

    if (!otp) return next(new AppError('Please provide a valid OTP', 400));

    const user = await User.findOne({ otp });
    console.log(user);
    req.user = user;

    if (!user) {
      return res.status(404).json({
        data: {
          status: 'fail',
          msg: 'Invalid OTP, Please try again!'
        }
      });
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
  if (currentUser) {
    res.status(200).json({
      status: 'success'
    });
  } else {
    res.status(404).json({
      status: 'error'
    });
  }
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

exports.logout = async (req, res, next) => {
  res.cookie('jwt', 'Logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  localStorage.removeItem('userName');

  res.status(200).json({
    status: 'success'
  });
};
