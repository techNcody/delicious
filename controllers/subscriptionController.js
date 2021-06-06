const Subscription = require('../models/subscriptionModel');

exports.createSubscription = async (req, res, next) => {
  req.body.fromDate = new Date().setDate(new Date().getDate() + 3);
  req.body.toDate = new Date().setDate(new Date().getDate() + 33);
  console.log(req.body);
  const subscription = await Subscription.create(req.body);

  res.status(200).json({
    status: 'success',
    data: subscription
  });
};
