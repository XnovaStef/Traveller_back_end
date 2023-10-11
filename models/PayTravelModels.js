const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the User schema
const UserPayTravel = new mongoose.Schema({
  nombre_place: {
    type: Number,
    required: true,
  },
  heure_depart: {
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
  montant: {
    type: String,
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
UserPayTravel.plugin(uniqueValidator);

// Create and export the User model
module.exports = mongoose.model('TravelPay', UserPayTravel);
