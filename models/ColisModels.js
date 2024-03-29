const mongoose = require('mongoose');

// Modèle de données pour les paiements
const ColisSchema = new mongoose.Schema({
tel: {
    type: String,
    required: true,
  },
nature: {
    type: String,
    required: true,
  },
  valeur_colis: {
    type: Number,
    required: true,
  },
  tel_destinataire: {
    type: String,
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
  montant: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  gare: {
    type: String,
    required: true,
  },
  datePay: {
    type: Date,
    required: true,
    default: Date.now
  },
timePay: {
    type: String,
    required: true,
    default: Date.now
  },
  codeExpiration: {
    type: Date, // Ajoutez le champ codeExpiration de type Date
    required: true, // Vous pouvez ajuster les exigences selon vos besoins
  },
});


// Création et export du modèle Payment
module.exports = mongoose.model('Colis', ColisSchema);
