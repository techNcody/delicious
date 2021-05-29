const Subscription = require('../models/subscriptionModel');

exports.createSubscription = async (req, res, next) => {
  const subscription = await Subscription.create(req.body);

  res.status(200).json({
    status: 'success',
    data: subscription
  });
};
