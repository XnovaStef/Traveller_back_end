const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the User schema
const UserPay = new mongoose.Schema({
  nombre_place: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  datePay: {
    type: Date,
    default: Date.now, // Sets the default value to the current date and time
  },
});

// Apply the uniqueValidator plugin to enforce uniqueness constraints
UserPay.plugin(uniqueValidator);

// Create and export the User model
module.exports = mongoose.model('Pay', UserPay);