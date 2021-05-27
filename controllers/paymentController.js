const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: 'rzp_test_8DuvnthMFg2vEm',
  key_secret: 'hRDqQirzqb7YQUCBOby2GLLH'
});

exports.createOrder = async (req, res, next) => {
  const amount = 5000 * 100;
  const currency = 'INR';
  const receipt = 'Receipt no. 1';
  const notes = {
    notes_key_1: 'Tea, Earl Grey, Hot',
    notes_key_2: 'Tea, Earl Grey… decaf.'
  };
  instance.orders
    .create({ amount, currency, receipt, notes })
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
