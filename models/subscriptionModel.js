const mongoose = require('mongoose');
// const validator = require('validator');

const subscriptionSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  requestId: {
    type: String,
    required: true
  },
  status: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
