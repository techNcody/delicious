const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const userRouter = require('./routes/userRouter');

app.use(cors());

// To make express understand which one is the static folder loction

// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS handling
app.use(function (req, res, next) {
  /*var err = new Error('Not Found');
   err.status = 404;
   next(err);*/
  /////////////////////////////////////////////////////////////////////////////
  // // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', '*');

  // // Request methods you wish to allow
  // res.setHeader(
  //   'Access-Control-Allow-Methods',
  //   'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  // );

  // // Request headers you wish to allow
  // res.setHeader(
  //   'Access-Control-Allow-Headers',
  //   'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization'
  // );
  /////////////////////////////////////////////////////////////////////////////

  //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Pass to next layer of middleware
  next();
});

app.use('/api/v2/users', userRouter);

module.exports = app;
