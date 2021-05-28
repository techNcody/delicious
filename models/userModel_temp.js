const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    minlength: 8,
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
  aadhaarNumber: Number,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// userSchema.pre('save', async function (next) {
//   const hashedPassword = await bcrypt.hash(this.password, 12);
//   this.password = hashedPassword;
//   this.passwordConfirm = undefined;
//   next();
// });

// userSchema.pre('validate', function (next) {
//   if (this.password !== this.passwordConfirm) {
//     this.invalidate('passwordConfirmation', 'enter the same password');
//   }
//   next();
// });

const User = mongoose.model('User', userSchema);

module.exports = User;
