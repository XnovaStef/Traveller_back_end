const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModels'); // Assuming this is the correct path to your User model
const RequestDeleteUser = require('../models/RequestModels')
const AccountForgot = require('../models/ForgotModels')
const Reservations = require('../models/TravelModels')
const Colis = require('../models/ColisModels')
const Pass = require('../models/PassModels');
const { now } = require('mongoose');
const Reservation = require('../models/ReservModels');
//const crypto = require('crypto');
const moment = require('moment');
const twilio = require('twilio');
//const sendSMS = require('../Controllers/testSms')

// Remplace ces valeurs par tes propres identifiants Twilio
const accountSid = 'ACb139d361d02b3c567685d69dc09594da';
const authToken = 'ac6f71833b4a4c0627677d8b36c3db43';
const client = twilio(accountSid, authToken);
const axios = require('axios');

const { Vonage } = require('@vonage/server-sdk');

// Initialise Vonage
const vonage = new Vonage({
  apiKey: "0d5dd3ec",
  apiSecret: "3vQStC3i1VFexes7"
});


                                                          // REGISTER USERS

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

exports.deleteUser = async (req, res) => {
  try {
    // Extract user data from the request body
    const { tel, password } = req.body;

    // Find the user by their phone number
    const user = await User.findOne({ tel });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // If the password is valid, delete the user
    await User.deleteOne({ _id: user._id });

    res.status(200).json({ message: 'User deleted successfully' });
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

/*exports.getUserByTel = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      // Vous pouvez extraire le numéro de téléphone de l'utilisateur ici
      const phoneNumber = user.tel;

      // Vous pouvez également inclure d'autres informations de l'utilisateur dans la réponse si nécessaire


      res.json(phoneNumber);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}*/


/*exports.deleteUserbyID = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndRemove(req.params.id);
    res.json(deletedUser);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}*/

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

                                                // toutes les informations sur les transactions

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

exports.everyTravelInfoTelCode = async (req, res) => {
  const { tel, code } = req.params; // Assuming tel is provided as a parameter in the request
  
  try {
    let travels = await Reservations.find({ tel, code }) // Filter by tel
      .select('tel nombre_place heure_depart compagnie destination montant code gare datePay nature timePay')
      .sort({ dateReserv: -1 });

    res.send(travels);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
  }
};

exports.everyColisInfoTelCode = async (req, res) =>{

  const { tel, code } = req.params; // Assuming tel is provided as a parameter in the request
  try{
    let colis = await Colis.find({ tel, code })
    .select('tel valeur_colis tel_destinataire compagnie destination montant code gare datePay nature timePay')
    .sort({datePay:-1})
    res.send(colis)
    }catch(e){
      console.log(e)
      res.status(500).json({message:'Error when getting all Colis Info'});
      }
}

exports.everyReservationInfoTelCode = async (req,res) => {

  const { tel, code } = req.params; // Assuming tel is provided as a parameter in the request
  try{
    let reservation = await Reservation.find({ tel, code })
    .select('tel nombre_place heure_depart destination compagnie gare code datePay nature timePay montant ')
    .sort({dateReserv:-1})
    res.send(reservation)
        }catch(e){
          console.log(e)
          res.status(500).json({message:'Erreur when getting the reservation'});
          }
}

exports.everyTravelInfoTel = async (req, res) => {
  const { tel } = req.params; // Assuming tel is provided as a parameter in the request
  
  try {
    let travels = await Reservations.find({ tel }) // Filter by tel
      .select('tel nombre_place heure_depart compagnie destination montant code gare datePay nature timePay')
      .sort({ dateReserv: -1 });

    res.send(travels);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
  }
};

exports.everyColisInfoTel = async (req, res) =>{

  const { tel } = req.params; // Assuming tel is provided as a parameter in the request
  try{
    let colis = await Colis.find({ tel })
    .select('tel valeur_colis tel_destinataire compagnie destination montant code gare datePay nature timePay')
    .sort({datePay:-1})
    res.send(colis)
    }catch(e){
      console.log(e)
      res.status(500).json({message:'Error when getting all Colis Info'});
      }
}

exports.everyReservationInfoTel = async (req,res) => {

  const { tel } = req.params; // Assuming tel is provided as a parameter in the request
  try{
    let reservation = await Reservation.find({ tel })
    .select('tel nombre_place heure_depart destination compagnie gare code datePay nature timePay montant ')
    .sort({dateReserv:-1})
    res.send(reservation)
        }catch(e){
          console.log(e)
          res.status(500).json({message:'Erreur when getting the reservation'});
          }
}

exports.rankingCompany = async (req, res) => {
  try {
    const allcompagnie = new Set();

    const compagnies = [Reservations, Reservation, Colis]

    for(const compagnie of compagnies){
      const resultat = await compagnie.distinct('compagnie');
      resultat.forEach((result) => allcompagnie.add(result));
    }
    const rankbycompany = [];
    for(const compagnia of allcompagnie){
      // Obtenez le nombre de documents pour chaque type
      const travels = await Reservations.countDocuments({compagnie : compagnia});
      const reservations = await Reservation.countDocuments({compagnie : compagnia});
      const coliss = await Colis.countDocuments({compagnie : compagnia});
      
      const totaldocuments = travels+reservations+coliss;
      
      rankbycompany.push({ compagnia, totaldocuments });
    }
    
    // Classer les compagnies par le nombre total de documents (du plus grand au plus petit)
    rankbycompany.sort((a, b) => b.totaldocuments - a.totaldocuments);

    console.log(rankbycompany);

    // Return the statistics as a JSON response
    res.json(rankbycompany);

  } catch (error) {
    console.error('Erreur lors du classement des compagnies par nombre d\'apparitions dans les voyages :', error);
    res.status(500).json({ success: false, error: 'Une erreur est survenue lors du classement des compagnies.' });
  }
};


exports.countNotifs = async (req,res) => {
  try {
    const notif = await RequestDeleteUser.find();
    const countNotif = notif.length
    res.json({notifications : countNotif});
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

exports.countTransaction = async (req, res) => {
  try {
        const reserv = await Reservation.find();
        const countReserv = reserv.length
        const colis = await Colis.find();
        const countCol = colis.length
        const travel = await Reservations.find();
        const countTrav = travel.length
        const total = countReserv + countCol + countTrav
        res.json({Transactions : total})
        }
        catch (err) {
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



exports.everyTravelInfo = async (req, res) => {
  
  try {
    let travels = await Reservations.find() // Filter by tel
      .select('tel nombre_place heure_depart compagnie destination montant code gare datePay nature timePay')
      .sort({ dateReserv: -1 });

    res.send(travels);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
  }
};

exports.everyReservationInfo = async (req,res) => {

  try{
    let reservation = await Reservation.find()
    .select('tel nombre_place heure_depart destination compagnie gare code datePay nature timePay')
    .sort({dateReserv:-1})
    res.send(reservation)
        }catch(e){
          console.log(e)
          res.status(500).json({message:'Erreur when getting the reservation'});
          }
}

exports.everyColisInfo = async (req, res) =>{
  try{
    let colis = await Colis.find()
    .select('tel valeur_colis tel_destinataire compagnie destination montant code gare datePay nature timePay')
    .sort({datePay:-1})
    res.send(colis)
    }catch(e){
      console.log(e)
      res.status(500).json({message:'Error when getting all Colis Info'});
      }
}



exports.getTravelsByUser = async (req, res) => {
  try {
    const userId = req.session.userId; // Obtenir l'ID de l'utilisateur depuis la session

    // Recherche tous les voyages associés à l'utilisateur spécifié
    const travels = await Reservations.find({ user: userId });

    if (!travels || travels.length === 0) {
      return res.status(404).json({ message: "Aucun voyage trouvé pour cet utilisateur" });
    }

    // Si des voyages sont trouvés, les renvoyer en tant que réponse
    res.status(200).json({ travels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};



                                         // STATISTIQUES DE TRANSACTIONS

 exports.countStatistics = async (req, res) => {
  try {
    const totalTravelCount = await Reservations.countDocuments();
    const totalReservationCount = await Reservation.countDocuments();
    const totalColisCount = await Colis.countDocuments();

    const totalDocuments = totalTravelCount + totalReservationCount + totalColisCount;

    if (totalDocuments === 0) {
      return res.json({ travelCount: 0, reservationCount: 0, colisCount: 0 });
    }

    const travelCount = totalTravelCount / totalDocuments;
    const reservationCount = totalReservationCount / totalDocuments;
    const colisCount = totalColisCount / totalDocuments;

    const counts = {
      travelCount: travelCount.toFixed(2),
      reservationCount: reservationCount.toFixed(2),
      colisCount: colisCount.toFixed(2),
    };

    res.json(counts);
  } catch (error) {
    console.error("Erreur lors du calcul des statistiques :", error);
    res.status(500).json({ message: error.message });
  }
};

exports.countStatisticsByCompany = async (req, res) => {
  try {
    // Recherchez toutes les compagnies dans chaque collection pertinente
    const allCompanies = new Set(); // Utilisez un ensemble pour éviter les doublons

    const collections = [Reservations, Reservation, Colis];

    for (const collection of collections) {
      const companies = await collection.distinct('compagnie');
      companies.forEach((company) => allCompanies.add(company));
    }

    const statsByCompany = [];

    for (const company of allCompanies) {
      // Obtenez le nombre de documents pour chaque type
      const travelCount = await Reservations.countDocuments({ compagnie: company });
      const reservationCount = await Reservation.countDocuments({ compagnie: company });
      const colisCount = await Colis.countDocuments({ compagnie: company });

      const totalDocuments = travelCount + reservationCount + colisCount;

      if (totalDocuments > 0) {
        statsByCompany.push({
          company: company,
          travelCount: ((travelCount / totalDocuments) * 100).toFixed(2),
          reservationCount: ((reservationCount / totalDocuments) * 100).toFixed(2),
          colisCount: ((colisCount / totalDocuments) * 100).toFixed(2),
        });
      }
    }

    // Return the statistics as a JSON response
    res.json(statsByCompany);
  } catch (error) {
    // Handle any errors and send an appropriate response
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



                                          // DATA TRANSACTIONS 

exports.dataTravel = async (req,res) => {
  try{
    if (req.params.year) {
      // Obtenir des données pour une année donnée
      const selectedYear = parseInt(req.params.year, 10);
      const startDate = new Date(selectedYear, 0, 1);
      const endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
      const data = await Reservations.find({
        datePay: { $gte: startDate, $lte: endDate },
      });
      res.json(data);
      } else {
        //Obtenir des années distinctes
        const years = await Reservations.distinct('datePay', { datePay: { $ne: null } })
        .then((dates) =>
          dates.map((date) => new Date(date).getFullYear())
        );
        res.json([...new Set(years)]);
        };
      } catch (err) {
        res.status(500).json({ error: err.message });
      };
}

exports.dataReservation = async (req, res) => {
  try {
    if (req.params.year) {
      // Obtenir des données pour une année donnée
      const selectedYear = parseInt(req.params.year, 10);
      const startDate = new Date(selectedYear, 0, 1);
      const endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
      const data = await Reservation.find({
        datePay: { $gte: startDate, $lte: endDate },
      });
      res.json(data);
    } else {
      // Obtenir des années distinctes
      const distinctYears = await Reservations.distinct('datePay', { datePay: { $ne: null } });
      const years = distinctYears.map((date) => new Date(date).getFullYear());
      const uniqueYears = [...new Set(years)];
      res.json(uniqueYears);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Une erreur est survenue lors du traitement de la demande.' });
  }
}; 



exports.loginPass = async (req, res) => {
  try {
    // Extract code and phone number from the request body
    const { code, tel } = req.body;

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

    // Check if the phone number matches the stored phone number (if stored)
    if (pass.tel !== tel) {
      return res.status(401).json({ message: 'Numéro de téléphone incorrect' });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ passId: pass._id }, 'your-secret-key'); // Replace with your secret key

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

                                          // CREATION DE TRANSCATION
// Function to make payment using CinetPay API
async function makeCinetPayPayment(paymentData) {
  try {
    // Check if "api_key" field is defined before attempting to convert to string
    if (paymentData.api_key !== undefined) {
      // Ensure that the "api_key" field is a string
      paymentData.api_key = paymentData.api_key.toString();
    } else {
      console.error('CinetPay API Error: "api_key" is undefined');
      return { success: false, error: '"api_key" is undefined' };
    }

    const cinetPayConfig = {
      method: 'post',
      url: 'https://api-checkout.cinetpay.com/v2/payment',
      headers: {
        'Content-Type': 'application/json',
      },
      data: paymentData,
    };

    const response = await axios(cinetPayConfig);

    // Check if 'data' property exists in the response
    if (response && response.data) {
      return { success: true, data: response.data };
    } else {
      console.error('CinetPay API Error: Invalid response format');
      return { success: false, error: 'Invalid response format' };
    }
  } catch (error) {
    console.error('CinetPay API Error:', error.response ? error.response.data : error.message);
    return { success: false, error: 'Payment failed' };
  }
}

exports.createTravel = async (req, res) => {
  try {
    // Extract data from the request body
    const { tel, nombre_place, heure_depart, compagnie, destination, montant, gare, heure_validation } = req.body;

    // Check if a user with the same phone number already exists
    const existingUser = await User.findOne({ tel });

    if (!existingUser) {
      return res.status(400).json({ message: 'Paiement non effectué, numéro de téléphone incorrect' });
    }

    // Automatically determine the 'nature' field value based on the presence of 'heure_validation'
    const nature = heure_validation ? 'reservation' : 'voyage';

    // Generate a random digit code (temporary password) with an expiration time
    const digitCode = Math.floor(1000 + Math.random() * 9000).toString();
    const codeExpiration = new Date();
    codeExpiration.setHours(codeExpiration.getHours() + 24); // Code expires in 24 hours

    // Prepare payment data for CinetPay
    const paymentData = {
      api_key: "51721003965a110f3828750.63222602", // Replace with your actual CinetPay API key
      site_id: "5867191", // Replace with your actual CinetPay site ID
      transaction_id: Math.floor(Math.random() * 100000000).toString(),
      amount: montant, // Assuming 'montant' is the amount from your request
      currency: "XOF", // Replace with the appropriate currency code
      description: "Payment for travel", // Replace with your actual description
      customer_id: existingUser._id,
      customer_name: "Ble", // Replace with the actual customer name
      customer_surname: "Stephane", // Replace with the actual customer surname
      customer_email: "falletkamagate3@gmail.com", // Replace with the actual customer email
      customer_phone_number: tel,
      // Add other relevant payment data fields
    };

    // Make CinetPay payment
    const cinetPayResult = await makeCinetPayPayment(paymentData);

    // Check the result of the CinetPay payment
    if (cinetPayResult.success) {
      // CinetPay payment successful, continue with saving the user and generating JWT token
      const newTravel = new Reservations({
        tel,
        nombre_place,
        heure_depart,
        compagnie,
        destination,
        montant,
        code: digitCode,
        codeExpiration,
        gare,
        user: existingUser._id,
        nature,
        datePay: new Date(),
        timePay: new Date().toLocaleTimeString(),
        tarifTravel: montant, // Assuming 'montant' is the tarifTravel value
      });

      // Save the user to the database
      await newTravel.save();

      // Create and send a JWT token for authentication
      const token = jwt.sign({ codeId: newTravel._id }, 'your-secret-key'); // Replace with your secret key
      res.status(201).json({ message: 'Paiement effectué', token,  code: digitCode, codeExpiration });

      // Save the code and tel in the "Pass" collection
      const newPass = new Pass({ tel, code: digitCode, codeExpiration });
      await newPass.save();
    } else {
      // CinetPay payment failed, send an appropriate response
      return res.status(400).json({ message: 'Paiement CinetPay échoué' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
                                          

exports.createColis = async (req, res) => {
  try {
    // Extract user data from the request body
    const { tel, valeur_colis, tel_destinataire, compagnie, destination, montant, gare, heure_validation } = req.body;

    // Check if a user with the same phone number already exists
    const existingUser = await User.findOne({ tel });

    if (!existingUser) {
      return res.status(400).json({ message: 'Paiement non effectué, numéro de téléphone incorrect' });
    }

       // Automatically determine the 'nature' field value based on the presence of 'heure_validation'
       const nature = heure_validation ? 'reservation' : 'colis';

    // Generate a random digit code (temporary password) with an expiration time
    const digitCode = Math.floor(1000 + Math.random() * 9000).toString();
    const codeExpiration = new Date();
    codeExpiration.setMinutes(codeExpiration.getMinutes() + 20); // Code expires in 20 minutes

    const paymentData = {
      api_key: "51721003965a110f3828750.63222602", // Replace with your actual CinetPay API key
      site_id: "5867191", // Replace with your actual CinetPay site ID
      transaction_id: Math.floor(Math.random() * 100000000).toString(),
      amount: montant, // Assuming 'montant' is the amount from your request
      currency: "XOF", // Replace with the appropriate currency code
      description: "Payment for travel", // Replace with your actual description
      customer_id: existingUser._id,
      customer_name: "Ble", // Replace with the actual customer name
      customer_surname: "Stephane", // Replace with the actual customer surname
      customer_email: "falletkamagate3@gmail.com", // Replace with the actual customer email
      customer_phone_number: tel,
      // Add other relevant payment data fields
    };

    // Make CinetPay payment
    const cinetPayResult = await makeCinetPayPayment(paymentData);

    if(cinetPayResult.success){
      // Create a new user document
    const newColis = new Colis({
      tel: tel,
      valeur_colis,
      tel_destinataire,
      compagnie,
      destination,
      montant,
      code: digitCode, // Store the hashed password
      codeExpiration, // Store code expiration time
      gare,
      nature, // Automatically set the 'nature' field
      datePay: new Date(), // Set the 'datePay' field to the current date and time
      timePay: new Date().toLocaleTimeString(), // Set the 'timePay' field to the current time
    });

    // Save the user to the database
    await newColis.save();

    // Create and send a JWT token for authentication
    const token = jwt.sign({ codeId: newColis._id }, 'your-secret-key'); // Replace with your secret key
    res.status(201).json({ message: 'Paiement effectué', token, code: digitCode, codeExpiration  });

    // Save the code and tel in the "Pass" collection
    const newPass = new Pass({ tel, code: digitCode, codeExpiration });
    await newPass.save();
    }  else {
      // CinetPay payment failed, send an appropriate response
      return res.status(400).json({ message: 'Paiement CinetPay échoué' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.Reservation = async (req, res) => {
  try {
    const { tel, nombre_place, heure_depart, compagnie, destination, gare } = req.body;

    // Votre validation d'utilisateur existant ici...

    const existingUser = await User.findOne({ tel });

    if (!existingUser) {
      return res.status(400).json({ message: 'Paiement non effectué, numéro de téléphone incorrect' });
    }

    const formattedTel = tel.replace('+', ''); // Retire le préfixe "+"
    const formattedTo = formattedTel.startsWith('225') ? formattedTel : `225${formattedTel}`;

    const heureDepartParts = heure_depart.split(':');
    if (heureDepartParts.length !== 2) {
      return res.status(400).json({ message: 'Format d\'heure de départ invalide. Utilisez hh:mm.' });
    }
    const hours = parseInt(heureDepartParts[0], 10);
    const minutes = parseInt(heureDepartParts[1], 10);

    const heure_depart_date = new Date();
    heure_depart_date.setUTCHours(hours);
    heure_depart_date.setUTCMinutes(minutes);

    const dateReserv = new Date();
    const heure_validation = new Date(dateReserv);
    heure_validation.setUTCDate(heure_validation.getUTCDate() + 1);

    const digitCode = Math.floor(1000 + Math.random() * 9000).toString();
    const codeExpiration = new Date();
    codeExpiration.setHours(codeExpiration.getHours() + 24);

    /*const message = `Votre code de réservation est : ${digitCode}. Valide jusqu'à ${codeExpiration.toLocaleTimeString()}.`;

    const from = 'Vonage APIs';

    const sendSMS = async () => {
      return new Promise((resolve, reject) => {
        vonage.message.sendSms(from, `+${formattedTo}`, message, (err, responseData) => {
          if (err) {
            console.error('Erreur lors de l\'envoi du SMS :', err);
            reject(err);
          } else {
            console.log('Message envoyé avec succès :', responseData);
            resolve(responseData);
          }
        });
      });
    };

    await sendSMS();*/

    const newReservation = new Reservation({
      tel,
      nombre_place,
      heure_depart: heure_depart_date,
      heure_validation,
      compagnie,
      code: digitCode,
      codeExpiration,
      destination,
      gare,
      nature: heure_validation ? 'reservation' : 'paiement',
      datePay: new Date(),
      timePay: new Date().toLocaleTimeString(),
    });

    const reservationEnregistree = await newReservation.save();

    const newPass = new Pass({ tel, code: digitCode, codeExpiration });
    await newPass.save();

    const token = jwt.sign({ codeId: newReservation._id }, 'your-secret-key');

    res.status(201).json({ message:  `Réservation enregistrée avec succès, veuillez vous présenter avant ${heure_validation.toISOString()}`, token,  code: digitCode, codeExpiration });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.afficherDernierCodeEnregistre = async (req, res) => {
  try {
    // Récupère le dernier code enregistré avec son codeExpiration associé
    const dernierCode = await Pass.findOne({}, 'code codeExpiration').sort({ _id: -1 });

    if (!dernierCode) {
      return res.status(404).json({ message: 'Aucun code enregistré.' });
    }

    // Formate la date du codeExpiration pour ne conserver que la date (sans l'heure)
    const codeExpirationDate = dernierCode.codeExpiration.toISOString().split('T')[0];

    res.status(200).json({ dernierCode: { code: dernierCode.code, codeExpiration: codeExpirationDate } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



///////////////////////////////////////// STATISTIQUES PAR JOUR, SEMAINES, Années



exports.StatsDetail = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalCounts = {
      reservations: await Reservation.countDocuments({}),
      colis: await Colis.countDocuments({}),
      travel: await Reservations.countDocuments({}),
    };

    const calculatePercentage = (count, total) => {
      return total > 0 ? (count / total) : 0;
    };

    const calculateNormalizedPercentage = (percentages) => {
      const sum = Object.values(percentages).reduce((acc, val) => acc + val, 0);
      const scaleFactor = sum !== 0 ? 1 / sum : 0;

      for (const key in percentages) {
        percentages[key] *= scaleFactor;
      }

      return percentages;
    };

    let stats = {
      today: {
        reservations: calculatePercentage(
          await Reservation.countDocuments({ datePay: { $gte: startOfDay } }),
          totalCounts.reservations
        ),
        colis: calculatePercentage(
          await Colis.countDocuments({ datePay: { $gte: startOfDay } }),
          totalCounts.colis
        ),
        travel: calculatePercentage(
          await Reservations.countDocuments({ datePay: { $gte: startOfDay } }),
          totalCounts.travel
        ),
      },
      thisWeek: {
        reservations: calculatePercentage(
          await Reservation.countDocuments({ datePay: { $gte: startOfWeek } }),
          totalCounts.reservations
        ),
        colis: calculatePercentage(
          await Colis.countDocuments({ datePay: { $gte: startOfWeek } }),
          totalCounts.colis
        ),
        travel: calculatePercentage(
          await Reservations.countDocuments({ datePay: { $gte: startOfWeek } }),
          totalCounts.travel
        ),
      },
      thisMonth: {
        reservations: calculatePercentage(
          await Reservation.countDocuments({ datePay: { $gte: startOfMonth } }),
          totalCounts.reservations
        ),
        colis: calculatePercentage(
          await Colis.countDocuments({ datePay: { $gte: startOfMonth } }),
          totalCounts.colis
        ),
        travel: calculatePercentage(
          await Reservations.countDocuments({ datePay: { $gte: startOfMonth } }),
          totalCounts.travel
        ),
      },
      thisYear: {
        reservations: calculatePercentage(
          await Reservation.countDocuments({ datePay: { $gte: startOfYear } }),
          totalCounts.reservations
        ),
        colis: calculatePercentage(
          await Colis.countDocuments({ datePay: { $gte: startOfYear } }),
          totalCounts.colis
        ),
        travel: calculatePercentage(
          await Reservations.countDocuments({ datePay: { $gte: startOfYear } }),
          totalCounts.travel
        ),
      },
    };

    // Normalizing percentages
    stats = {
      today: calculateNormalizedPercentage(stats.today),
      thisWeek: calculateNormalizedPercentage(stats.thisWeek),
      thisMonth: calculateNormalizedPercentage(stats.thisMonth),
      thisYear: calculateNormalizedPercentage(stats.thisYear),
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


///////////////////////////////////////// STATISTIQUES PAR JOUR, SEMAINES, Années en entrant des informations

exports.getStats = async (req, res) => {
  try {
    const { day, month, year } = req.query;

    const today = new Date();
    const startDate = new Date(year, month - 1, day);
    const endDate = new Date(year, month - 1, parseInt(day) + 1);

    console.log('startDate:', startDate.toISOString().split('T')[0]);
    console.log('endDate:', endDate.toISOString().split('T')[0]);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const stats = {
      selectedPeriod: {
        reservations: await Reservation.countDocuments({
          datePay: { $gte: formattedStartDate, $lt: formattedEndDate }
        }),
        colis: await Colis.countDocuments({
          datePay: { $gte: formattedStartDate, $lt: formattedEndDate }
        }),
        travel: await Reservations.countDocuments({
          datePay: { $gte: formattedStartDate, $lt: formattedEndDate }
        }),
      },
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};




{/* //Code pour compter le nombre de places vendus
exports.dataReservation = async (req, res) => {
  try {
    if (req.params.year) {
      // Obtenir des données pour une année donnée
      const selectedYear = parseInt(req.params.year, 10);
      const startDate = new Date(selectedYear, 0, 1);
      const endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
      const data = await Reservation.find({
        datePay: { $gte: startDate, $lte: endDate },
      });
      res.json(data);
    } else {
      // Obtenir des années distinctes
      const distinctYears = await Reservations.distinct('datePay', { datePay: { $ne: null } });
      const years = distinctYears.map((date) => new Date(date).getFullYear());
      const uniqueYears = [...new Set(years)];
      res.json(uniqueYears);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Une erreur est survenue lors du traitement de la demande.' });
  }
}; 

//Compter les voyages (nombre de place)
exports.dataTravel = async (req,res) => {
  try{
    if (req.params.year) {
      // Obtenir des données pour une année donnée
      const selectedYear = parseInt(req.params.year, 10);
      const startDate = new Date(selectedYear, 0, 1);
      const endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
      const data = await Reservations.find({
        datePay: { $gte: startDate, $lte: endDate },
      });
      res.json(data);
      } else {
        //Obtenir des années distinctes
        const years = await Reservations.distinct('datePay', { datePay: { $ne: null } })
        .then((dates) =>
          dates.map((date) => new Date(date).getFullYear())
        );
        res.json([...new Set(years)]);
        };
      } catch (err) {
        res.status(500).json({ error: err.message });
      };
}
*/}









