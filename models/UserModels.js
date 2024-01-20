const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the User schema
const UserSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
  },
  residence: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now, // Sets the default value to the current date and time
  },
});

// Apply the uniqueValidator plugin to enforce uniqueness constraints
UserSchema.plugin(uniqueValidator);

// Create and export the User model
module.exports = mongoose.model('User', UserSchema);