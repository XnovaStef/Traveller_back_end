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

exports.everyTravelInfo = async (req, res) =>{
  try{
    let travels = await Reservations.find()
    .select('phone nombre_place heure_depart compagnie destination montant code gare datePay nature timePay')
    .sort({datePay:-1})
    res.send(travels)
    }catch(e){
      console.log(e)
      res.status(500).json({message:'Error when getting all Travels Info'});
      }
}

exports.getTravelInfoByTel = async (req, res) => {
  const { phone } = req.body; // Assurez-vous que vous avez configuré votre route pour inclure le paramètre "tel" dans l'URL.

  try {
    // Vérifiez d'abord si le numéro de téléphone existe dans la base de données.
    const user = await User.findOne({ tel }); // Assurez-vous d'adapter ceci en fonction du modèle utilisateur de votre base de données.

    if (user) {
      // Si l'utilisateur existe, recherchez les voyages associés à ce numéro de téléphone.
      const travels = await Reservations.find({ phone})
        .select('phone nombre_place heure_depart compagnie destination montant code gare datePay nature timePay')
        .sort({ datePay: -1 });

      res.send(travels);
    } else {
      // Si l'utilisateur n'existe pas, renvoyez un message indiquant qu'aucun utilisateur n'a été trouvé.
      res.status(404).json({ message: 'Aucun utilisateur avec ce numéro de téléphone trouvé.' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Erreur lors de la récupération des informations de voyage.' });
  }
};

exports.getColisInfoByTel = async (req, res) => {
  const { phone } = req.body; // Assurez-vous que vous avez configuré votre route pour inclure le paramètre "tel" dans l'URL.

  try {
    // Vérifiez d'abord si le numéro de téléphone existe dans la base de données.
    const user = await User.findOne({ phone }); // Assurez-vous d'adapter ceci en fonction du modèle utilisateur de votre base de données.

    if (user) {
      // Si l'utilisateur existe, recherchez les voyages associés à ce numéro de téléphone.
      const colis = await Colis.find({phone })
        .select('phone valeur_colis tel_destinataire compagnie destination montant code gare datePay nature timePay')
        .sort({ datePay: -1 });

      res.send(colis);
    } else {
      // Si l'utilisateur n'existe pas, renvoyez un message indiquant qu'aucun utilisateur n'a été trouvé.
      res.status(404).json({ message: 'Aucun utilisateur avec ce numéro de téléphone trouvé.' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Erreur lors de la récupération des informations de voyage.' });
  }
};


exports.getReservInfoByTel = async (req, res) => {
  const { phone } = req.body; // Assurez-vous que vous avez configuré votre route pour inclure le paramètre "tel" dans l'URL.

  try {
    // Vérifiez d'abord si le numéro de téléphone existe dans la base de données.
    const user = await User.findOne({ phone }); // Assurez-vous d'adapter ceci en fonction du modèle utilisateur de votre base de données.

    if (user) {
      // Si l'utilisateur existe, recherchez les voyages associés à ce numéro de téléphone.
      const reserv = await Reservation.find({ phone })
        .select('phone nombre_place heure_depart heure_validation compagnie destination code gare datePay nature timePay')
        .sort({ datePay: -1 });

      res.send(reserv);
    } else {
      // Si l'utilisateur n'existe pas, renvoyez un message indiquant qu'aucun utilisateur n'a été trouvé.
      res.status(404).json({ message: 'Aucun utilisateur avec ce numéro de téléphone trouvé.' });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Erreur lors de la récupération des informations de voyage.' });
  }
};

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
                                          // CREATION DE TRANSCATION

exports.createTravel = async (req, res) => {
  try {
    // Extract user data from the request body
    let {tel, nombre_place, heure_depart, compagnie, destination, montant, gare, heure_validation } = req.body;

    // Add "+225" to the beginning of the phone number
    //tel = "+225" + tel;

    // Check if a user with the same phone number already exists
    const existingUser = await User.findOne({tel});

    if (!existingUser) {
      return res.status(400).json({ message: 'Paiement non effectué, numéro de téléphone incorrect' });
    }

    // Automatically determine the 'nature' field value based on the presence of 'heure_validation'
    const nature = heure_validation ? 'reservation' : 'voyage';

    // Generate a random digit code (temporary password) with an expiration time
    const digitCode = Math.floor(1000 + Math.random() * 9000).toString();
    const codeExpiration = new Date();
    codeExpiration.setHours(codeExpiration.getHours() + 24); // Code expires in 24 hours


    // Create a new user document
    const newTravel = new Reservations({
      tel: tel,
      nombre_place,
      heure_depart,
      compagnie,
      destination,
      montant,
      code: digitCode, // Store the hashed password
      codeExpiration, // Store code expiration time
      gare,
      user: existingUser._id,
      nature, // Automatically set the 'nature' field
      datePay: new Date(), // Set the 'datePay' field to the current date and time
      timePay: new Date().toLocaleTimeString(), // Set the 'timePay' field to the current time
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
    res.status(201).json({ message: 'Paiement effectué', token });

    // Save the code and tel in the "Pass" collection
    const newPass = new Pass({ tel, code: digitCode, codeExpiration });
    await newPass.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.Reservation = async (req, res) => {
  try {
    // Récupérez les informations de la réservation à partir de la requête
    const {tel, nombre_place, heure_depart, compagnie, destination, gare } = req.body;

    const existingUser = await User.findOne({ tel });

    if (!existingUser) {
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
    codeExpiration.setMinutes(codeExpiration.getMinutes() + 15); // Code expires in 15 minutes

    // Automatically determine the 'nature' field value based on the presence of 'heure_validation'
    const nature = heure_validation ? 'reservation' : 'paiement';

    // Créez une nouvelle instance de Reservation avec les informations fournies
    const newReservation = new Reservation({
      tel :tel,
      nombre_place,
      heure_depart: heure_depart_date,
      heure_validation,
      compagnie,
      code: digitCode, // Store the hashed password
      codeExpiration, // Store code expiration time
      destination,
      gare,
      nature, // Automatically set the 'nature' field
      datePay: new Date(), // Set the 'datePay' field to the current date and time
      timePay: new Date().toLocaleTimeString(), // Set the 'timePay' field to the current time
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









