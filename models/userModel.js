const mongoose = require('mongoose');
// const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    minlength: 4,
    maxlength: 50
  },
  mobileNumber: {
    type: Number,
    trim: true,
    required: [true, 'Please provide your mobile number'],
    minlength: 10,
    maxlength: 10
  },
  otp: {
    type: Number,
    default: 0000
  },
  email: {
    type: String,
    required: [true, 'An user must have an email.'],
    unique: true,
    lowercase: true
    // validate: [validator.isEmail, 'Please provide a valid Email.'],
  },
  role: {
    type: String,
    enum: ['admin', 'customer', 'vendor', 'delivery-person'],
    default: 'customer'
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  address: [
    {
      addressLine1: {
        type: String,
        required: true
      },
      addressLine2: {
        type: String,
        required: true
      },
      addressLine3: {
        type: String,
        required: true
      },
      pincode: {
        type: Number,
        required: true
      },
      landmark: {
        type: String
      },
      locality: {
        type: String
      }
    }
  ],
  aadhaarNumber: Number,
  companyName: String,
  GSTIN: String,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
