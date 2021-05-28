const mongoose = require('mongoose');
// const validator = require('validator');

const requestSchema = new mongoose.Schema({
  mealType: {
    type: String,
    required: true
  },
  userCustomerEmail: String,
  userVendorEmail: String,
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
        type: String,
        required: true
      },
      locality: {
        type: String,
        required: true
      }
    }
  ],
  contactPerson: {
    type: String,
    required: true
  },
  contactPersonMobileNumber: {
    type: Number,
    required: true
  },
  message: String
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
