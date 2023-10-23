const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModels'); // Assuming this is the correct path to your User model
const RequestDeleteUser = require('../models/RequestModels')
const AccountForgot = require('../models/ForgotModels')
const Travel = require('../models/TravelModels')
const Colis = require('../models/ColisModels')
const Pass = require('../models/PassModels');
const { now } = require('mongoose');
const Reservation = require('../models/ReservModels')
//const crypto = require('crypto');


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

exports.countUsers = async (req,res)=>{
  try{
      const user = await User.find(); // récupérer tous les utilisateurs
      const userCount = user.length
      res.json({countUser : userCount });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
 
}

exports.countNotifs = async (req,res) => {
  try {
    const notif = await RequestDeleteUser.find();
    const countNotif = notif.length;
    res.send({notifications : countNotif});
    } catch (err) {
      res.status(500).json({ message: err.message }) 
      }
}

exports.countReservation = async (req, res) => {
  try {
        const reserv = await Reservation.find();
        const countReservation = reserv.length
        res.json({countReservation : countReservation});
        } catch (err) {
          res.status(500).json({ message: err.message })
          }
}

exports.everyUserInfo = async (req, res) =>{
  try{
    let users = await User.find()
    .select('pseudo residence occupation tel dateAdded')
    .sort({dateAdded:-1})
    res.send(users)
    }catch(e){
      console.log(e)
      res.status(500).json({message:'Error when getting all Users Info'});
      }
}

exports.everyTravelInfo = async (req, res) =>{
  try{
    let travels = await Travel.find()
    .select('tel nombre_place heure_depart compagnie destination montant code gare datePay')
    .sort({datePay:-1})
    res.send(travels)
    }catch(e){
      console.log(e)
      res.status(500).json({message:'Error when getting all Travels Info'});
      }
}

exports.everyColisInfo = async (req, res) =>{
  try{
    let colis = await Colis.find()
    .select('tel valeur_colis tel_destinataire compagnie destination montant code gare datePay')
    .sort({datePay:-1})
    res.send(colis)
    }catch(e){
      console.log(e)
      res.status(500).json({message:'Error when getting all Colis Info'});
      }
}

exports.everyReservationInfo = async (req,res) => {
  try{
    let reservation = await Reservation.find()
    .select('tel nombre_place heure_depart destination compagnie gare code dateReserv')
    .sort({dateReserv:-1})
    res.send(reservation)
        }catch(e){
          console.log(e)
          res.status(500).json({message:'Erreur when getting the reservation'});
          }
}

exports.everyNotifInfo = async (req,res) => {
  try{
    let notifs = await RequestDeleteUser.find()
    .select('tel pattern dateAdded')
    .sort({dateAdded:-1})
    res.send(notifs)
    }catch(e){
      console.log(e)
      res.status(500).json({message:'Error when getting notifications info'});
      }
}

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

exports.createTravel = async (req, res) => {
  try {
    // Extract user data from the request body
    const { tel, nombre_place, heure_depart, compagnie, destination, montant, gare } = req.body;

    // Check if a user with the same phone number already exists
    const existingUser = await User.findOne({ tel });

    if (existingUser) {
      return res.status(400).json({ message: 'Paiement non effectué, numéro de téléphone incorrect' });
    }

    // Generate a random digit code (temporary password) with an expiration time
    const digitCode = Math.floor(1000 + Math.random() * 9000).toString();
    const codeExpiration = new Date();
    codeExpiration.setMinutes(codeExpiration.getMinutes() + 6); // Code expires in 15 minutes

    // Create a new user document
    const newTravel = new Travel({
      tel,
      nombre_place,
      heure_depart,
      compagnie,
      destination,
      montant,
      code: digitCode, // Store the hashed password
      codeExpiration, // Store code expiration time
      gare
    });

    // Save the user to the database
    await newTravel.save();

    // Create and send a JWT token for authentication
    const token = jwt.sign({ codeId: newTravel._id }, 'your-secret-key'); // Replace with your secret key
    res.status(201).json({ message: 'Paiement effectué', token });

    // Save the code and tel in the "Pass" collection
    const newPass = new Pass({ tel, code: digitCode, codeExpiration });
    await newPass.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createColis = async (req, res) => {
  try {
    // Extract user data from the request body
    const { tel, valeur_colis, tel_destinataire, compagnie, destination, montant, gare } = req.body;

    // Check if a user with the same phone number already exists
    const existingUser = await User.findOne({ tel });

    if (existingUser) {
      return res.status(400).json({ message: 'Paiement non effectué, numéro de téléphone incorrect' });
    }

    // Generate a random digit code (temporary password) with an expiration time
    const digitCode = Math.floor(1000 + Math.random() * 9000).toString();
    const codeExpiration = new Date();
    codeExpiration.setMinutes(codeExpiration.getMinutes() + 6); // Code expires in 15 minutes

    // Create a new user document
    const newTravel = new Travel({
      tel,
      valeur_colis,
      tel_destinataire,
      compagnie,
      destination,
      montant,
      code: digitCode, // Store the hashed password
      codeExpiration, // Store code expiration time
      gare
    });

    // Save the user to the database
    await newColis.save();

    // Create and send a JWT token for authentication
    const token = jwt.sign({ codeId: newColis._id }, 'your-secret-key'); // Replace with your secret key
    res.status(201).json({ message: 'Paiement effectué', token });

    // Save the code and tel in the "Pass" collection
    const newPass = new Pass({ tel, code: digitCode, codeExpiration });
    await newPass.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.loginPass = async (req, res) => {
  try {
    // Extract the code from the request body
    const { code } = req.body;

    // Find the corresponding pass (code) in the Pass collection
    const pass = await Pass.findOne({ code });

    if (!pass) {
      return res.status(401).json({ message: 'Code incorrect' });
    }

    // Check if the code has expired
    const currentTimestamp = new Date();
    if (pass.codeExpiration && currentTimestamp > new Date(pass.codeExpiration)) {
      return res.status(401).json({ message: 'Code expiré' });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ passId: pass._id }, 'your-secret-key'); // Replace with your secret key

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};















exports.Reservation = async (req, res) => {
  try {
    // Récupérez les informations de la réservation à partir de la requête
    const { tel, nombre_place, heure_depart, compagnie, destination, gare } = req.body;

    const existingUser = await User.findOne({ tel });

    if (existingUser) {
      return res.status(400).json({ message: 'Paiement non effectué, numéro de téléphone incorrect' });
    }

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

    // Calculez la valeur de heure_validation en ajoutant 24 heures à dateReserv
    const dateReserv = new Date(); // Obtenez la date et l'heure actuelles
    const heure_validation = new Date(dateReserv);
    heure_validation.setUTCDate(heure_validation.getUTCDate() + 1); // Ajoute 24 heures

      // Generate a random digit code (temporary password) with an expiration time
      const digitCode = Math.floor(1000 + Math.random() * 9000).toString();
      const codeExpiration = new Date();
      codeExpiration.setMinutes(codeExpiration.getMinutes() + 1); // Code expires in 15 minutes

    // Créez une nouvelle instance de Reservation avec les informations fournies
    const newReservation = new Reservation({
      tel,
      nombre_place,
      heure_depart: heure_depart_date,
      heure_validation,
      compagnie,
      code: digitCode, // Store the hashed password
      codeExpiration, // Store code expiration time
      destination,
      gare,
    });

    // Enregistrez la réservation dans la base de données
    const reservationEnregistree = await newReservation.save();

    
    // Save the code and tel in the "Pass" collection
    const newPass = new Pass({ tel, code: digitCode, codeExpiration });
    await newPass.save();

     // Create and send a JWT token for authentication
     const token = jwt.sign({ codeId: newReservation._id }, 'your-secret-key'); // Replace with your secret key
     res.status(201).json({ message:  `Réservation enregistrée avec succès, veuillez vous présenter avant ${heure_validation.toISOString()}`, token });



    
  } catch (error) {
    // Gérez les erreurs appropriées ici
    res.status(500).json({ message: error.message });
  }
}








