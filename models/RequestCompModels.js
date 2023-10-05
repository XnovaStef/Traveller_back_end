const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the User schema
const CompanyDemande = new mongoose.Schema({
  email: {
    type: String,
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
CompanyDemande.plugin(uniqueValidator);

// Create and export the User model
module.exports = mongoose.model('RequestDeleteCompany', CompanyDemande);