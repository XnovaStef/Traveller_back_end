const mongoose = require('mongoose');

// Modèle de données pour les paiements
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
password: {
    type: String,
    required: true,
  },

});


// Création et export du modèle Payment
module.exports = mongoose.model('Admin', AdminSchema);
