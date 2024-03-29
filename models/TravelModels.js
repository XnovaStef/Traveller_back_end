const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Modèle de données pour les paiements
const TravelSchema = new mongoose.Schema({
tel: {
    type: String,
    required: true,
  },
nature: {
    type: String,
    required: true,
  },
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assurez-vous que c'est le même que le modèle d'utilisateur que vous avez défini
    required: true
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
module.exports = mongoose.model('Travel', TravelSchema);
