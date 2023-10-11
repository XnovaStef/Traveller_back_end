const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the User schema
const UserReserv = new mongoose.Schema({
 nombre_place: {
    type: Number,
    required: true,
  },
  heure_depart: {
    type: String,  // Modifier le type en String
    required: true,
  },
  heure_validation: {
    type: Date,
    required: true,
  },
  compagnie: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  gare: {
    type: String,
    required: true,
  },
  datePay: {
    type: Date,
    default: Date.now,
  },
});

// Apply the uniqueValidator plugin to enforce uniqueness constraints
UserReserv.plugin(uniqueValidator);

// Create and export the User model
module.exports = mongoose.model('Rerservation', UserReserv);
