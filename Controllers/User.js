const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModels'); // Assuming this is the correct path to your User model
const RequestDeleteUser = require('../models/RequestModels')
const AccountForgot = require('../models/ForgotModels')
const ColisPay = require('../models/PayColisModels')
const Reservation = require('../models/ReservModels')
const crypto = require('crypto');

// Define a route for user registration
exports.UserModels = async (req, res) => {
  try {
    // Extract user data from the request body
    const { pseudo, residence, occupation, tel, password } = req.body;

    // Check if a user with the same phone number already exists
    const existingUser = await User.findOne({ tel });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Create a new user document
    const newUser = new User({
      pseudo,
      residence,
      occupation,
      tel,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    await newUser.save();

    // Create and send a JWT token for authentication
    const token = jwt.sign({ userId: newUser._id }, 'your-secret-key'); // Replace with your secret key
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.userLogin = async (req, res) => {
  try {
    // Extract user data from the request body
    const { tel, password } = req.body;

    // Check if a user with the provided phone number exists
    const user = await User.findOne({ tel });

    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // If the phone number and password are valid, create and send a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, 'mySecretKey', { expiresIn: '15m' }); // Replace with your secret key
    res.status(200).json({ message: 'Login successful', token ,  userId: user._id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.modifyUserName = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'a pas été trouvé" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    if (req.body.pseudo != null) {
      user.pseudo = req.body.pseudo;
    }
    
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.modifyUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'a pas été trouvé" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    if (req.body.pseudo != null) {
      user.pseudo = req.body.pseudo;
    }
    
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.modifyUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'a pas été trouvé" });
    }

    // Check if the user provided the current password in the request
    if (!req.body.currentPassword) {
      return res.status(400).json({ message: "Veuillez fournir le mot de passe actuel." });
    }

    // Verify the provided current password against the stored hash
    const validCurrentPassword = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!validCurrentPassword) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect.' });
    }

    // Update the password with the new one
    if (req.body.newPassword) {
      // Hash the new password before saving it
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.makeDeletionRequest = async (req, res) => {
  try {

    // Extract email and password from the request body
    const { tel, password } = req.body;

    // Check if a company with the provided email exists
    const user = await User.findOne({ tel });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    // Check if the user provided the current password in the request
    if (!password) {
      return res.status(400).json({ message: "Veuillez fournir le mot de passe actuel." });
    }

    // Verify the provided password against the stored hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Create a deletion request object
    const deletionRequest = new RequestDeleteUser({
      tel: req.body.tel, // Use the provided telephone number from the request
      password: user.password, // You may want to hash this password for security.
      pattern: req.body.pattern, // Include any other relevant data for the deletion request.
    });

    // Save the deletion request
    const savedRequest = await deletionRequest.save();

    res.json(savedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.ForgotPassword = async (req, res) => {
  try {
    // Check if the user with the provided phone number exists
    const user = await User.findOne({ tel: req.body.tel });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Generate a random 6-digit code
    const generatedCode = "xnova@@";

    // Hash the generated code
    const salt = await bcrypt.genSalt(10);
    const hashedCode = await bcrypt.hash(generatedCode, salt);

    // Update the user's password with the hashed code
    user.password = hashedCode;
    await user.save();

    // Record the generated code in the AccountForgot table
    const accountForgot = new AccountForgot({
      tel: req.body.tel,
      code: generatedCode, // Save the generated code in the AccountForgot table
    });
    await accountForgot.save();

    // Generate a JWT token
    const token = jwt.sign({ codeId: user._id }, 'your-secret-key', {
      expiresIn: '1h', // You can set the expiration time as needed
    });

    res.status(200).json({
      message: 'Code généré et mot de passe utilisateur mis à jour avec succès.',
      token: token, // Include the token in the response
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getCodeById = async (req, res) => {
  try {
    const code = await AccountForgot.findById(req.params.id);
    res.json(code);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
exports.PaymentTravel = async (req, res) => {
  try {
    // Récupérez les informations du paiement à partir de la requête
    const { nombre_place, heure_depart, compagnie, destination, montant, gare } = req.body;

    // Générez un code alphanumérique aléatoire
    const codeAlphanum = crypto.randomBytes(6).toString('hex'); // Vous pouvez ajuster la longueur du code en modifiant le nombre d'octets

    // Créez une nouvelle instance de UserPay avec les informations fournies
    const nouveauPaiement = new TravelPay({
      nombre_place,
      heure_depart,
      compagnie,
      destination,
      montant,
      gare,
      code_ticket: codeAlphanum, // Utilisation du code généré
    });

    // Enregistrez le paiement dans la base de données
    const paiementEnregistre = await nouveauPaiement.save();

    // Retournez les détails du paiement enregistré
    res.status(200).json({
      message: 'Paiement enregistré avec succès.',
      payment: paiementEnregistre,
    });
  } catch (error) {
    // Gérez les erreurs appropriées ici
    res.status(500).json({ message: error.message });
  }
}

exports.PaymentColis = async (req, res) => {
  try {
    // Récupérez les informations du paiement à partir de la requête
    const { valeur_colis, Tarif, compagnie, destination, gare } = req.body;

    // Générez un code alphanumérique aléatoire
    const codeAlphanum = crypto.randomBytes(6).toString('hex'); // Vous pouvez ajuster la longueur du code en modifiant le nombre d'octets

    // Créez une nouvelle instance de UserPay avec les informations fournies
    const nouveauPaiement = new ColisPay({
      valeur_colis,
      Tarif,
      compagnie,
      destination,
      gare,
      code_ticket: codeAlphanum, // Utilisation du code généré
    });

    // Enregistrez le paiement dans la base de données
    const paiementEnregistre = await nouveauPaiement.save();

    // Retournez les détails du paiement enregistré
    res.status(200).json({
      message: 'Paiement enregistré avec succès.',
      payment: paiementEnregistre,
    });
  } catch (error) {
    // Gérez les erreurs appropriées ici
    res.status(500).json({ message: error.message });
  }
}

exports.Reservation = async (req, res) => {
  try {
    // Récupérez les informations de la réservation à partir de la requête
    const { nombre_place, heure_depart, compagnie, destination, gare } = req.body;

    // Créez une date avec l'heure et les minutes spécifiées et le fuseau horaire de la Côte d'Ivoire (UTC+0)
    const heureDepartParts = heure_depart.split(':');
    if (heureDepartParts.length !== 2) {
      return res.status(400).json({ message: 'Format d\'heure de départ invalide. Utilisez hh:mm.' });
    }
    const hours = parseInt(heureDepartParts[0], 10);
    const minutes = parseInt(heureDepartParts[1], 10);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours >= 24 || minutes < 0 || minutes >= 60) {
      return res.status(400).json({ message: 'Heure de départ invalide.' });
    }

    // Créez une nouvelle date avec l'heure et les minutes spécifiées et le fuseau horaire de la Côte d'Ivoire (UTC+0)
    const heure_depart_date = new Date();
    heure_depart_date.setUTCHours(hours);
    heure_depart_date.setUTCMinutes(minutes);

    // Calculez la valeur de heure_validation en ajoutant 24 heures à heure_depart_date
    const heure_validation = new Date(heure_depart_date);
    heure_validation.setUTCHours(heure_validation.getUTCHours() + 24);

    // Créez une nouvelle instance de Reservation avec les informations fournies
    const newReservation = new Reservation({
      nombre_place,
      heure_depart: heure_depart_date,
      heure_validation,
      compagnie,
      destination,
      gare,
    });

    // Enregistrez la réservation dans la base de données
    const reservationEnregistree = await newReservation.save();

    // Retournez les détails de la réservation enregistrée
    res.status(200).json({
      message: 'Réservation enregistrée avec succès.',
      reservation: reservationEnregistree,
    });
  } catch (error) {
    // Gérez les erreurs appropriées ici
    res.status(500).json({ message: error.message });
  }
}






