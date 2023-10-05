 const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the User schema
const UserDemande = new mongoose.Schema({
  tel: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pattern: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now, // Sets the default value to the current date and time
  },
});

// Apply the uniqueValidator plugin to enforce uniqueness constraints
UserDemande.plugin(uniqueValidator);

// Create and export the User model
module.exports = mongoose.model('RequestDeleteUser', UserDemande);