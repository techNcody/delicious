const Razorpay = require('razorpay');
const Request = require('../models/requestModel');

var instance = new Razorpay({
  key_id: 'rzp_test_8DuvnthMFg2vEm',
  key_secret: 'hRDqQirzqb7YQUCBOby2GLLH'
});

exports.createOrder = async (req, res, next) => {
  let amount = 0;
  // console.log(req.user);
  const request = await Request.findOne({
    userCustomerEmail: req.user.email
  });
  // console.log(request);
  if (request) {
    if (request.mealType === 'non-veg') {
      amount = 2100 * 100;
    } else if (request.mealType === 'veg') {
      amount = 1800 * 100;
    }
  }
  // const amount = 5000 * 100;
  const currency = 'INR';
  const receipt = 'Reciept no.';
  const notes = {
    notes_key_1: request.mealType
    // notes_key_2: 'Tea, Earl Grey… decaf.'
  };
  instance.orders
    .create({ amount, currency, receipt, notes })
    .then((response) => {
      console.log(response);
      res.status(200).json({
        status: 'success',
        data: response,
        user: req.user
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        status: 'error',
        data: error
      });
    });
};

exports.getOrder = (req, res, next) => {
  instance.orders
    .fetch(req.body.orderId)
    .then((response) => {
      res.status(200).json({
        status: 'success',
        data: response
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: 'error',
        data: error
      });
    });
};

exports.fetchPaymentOnOrder = (req, res, next) => {
  instance.orders
    .fetchPayments(req.body.orderId)
    .then((response) => {
      res.status(200).json({
        status: 'success',
        data: response
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        status: 'error',
        data: error
      });
    });
};

exports.capturePayment = (req, res, next) => {
  paymentId = 'P001';
  amount = 5000 * 100;
  currency = 'INR';
  instance.payments
    .capture(paymentId, amount, currency)
    .then((response) => {
      res.status(200).json({
        status: 'success',
        data: response
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        status: 'error',
        data: error
      });
    });
};
