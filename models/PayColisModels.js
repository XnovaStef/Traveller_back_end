const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the User schema
const UserPayColis = new mongoose.Schema({
 valeur_colis: {
    type: String,
    required: true,
  },
 Tarif: {
    type: String,
    required: true,
  },
  compagnie: {
    type: String,
    required: true,
  },
  destination: {
    type: String,  // This allows "destination" to be of type String
    required: true,
  },
 gare: {
    type: String,
    required: true,
  },
  code_ticket: {
    type: String,
    required: true,
  },
  datePay: {
    type: Date,
    default: Date.now,
  },
});

// Apply the uniqueValidator plugin to enforce uniqueness constraints
UserPayColis.plugin(uniqueValidator);

// Create and export the User model
module.exports = mongoose.model('ColisPay', UserPayColis);
