const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the User schema
const PassSchema = new mongoose.Schema({
phone: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    required: true,
  },

  codeExpiration: {
    type: Date, // Ajoutez le champ codeExpiration de type Date
    required: true, // Vous pouvez ajuster les exigences selon vos besoins
  },

  dateAdded: {
    type: Date,
    default: Date.now, // Sets the default value to the current date and time
  },
});

// Apply the uniqueValidator plugin to enforce uniqueness constraints
PassSchema.plugin(uniqueValidator);

// Create and export the User model
module.exports = mongoose.model('Pass', PassSchema);