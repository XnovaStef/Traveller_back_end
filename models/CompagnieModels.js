const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const CompanySchema = new mongoose.Schema({
  compagnie: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  destinationTravel: [
    {
      destination: {
        type: String,
        required: true,
      },
      Travel: {
        type: Number,
        required: true,
      },
      Colis: {
        type: Number,
        required: true,
      },
      gare: {
        type: String,
        required: true,
      },
    },
  ],
 
  depart: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

CompanySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Company', CompanySchema);
