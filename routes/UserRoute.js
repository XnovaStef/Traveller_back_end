const express = require('express');
const router = express.Router();
const {
  UserModels,
  userLogin,
  modifyUserName,
  modifyUserPassword,
  makeDeletionRequest,
  ForgotPassword,
  getUserById,
  createTravel,
  createColis,
  loginPass,
  countUsers,
  Reservation, 
  everyUserInfo,
  everyReservationInfoTel,
  everyTravelInfoTel,
  everyColisInfoTel,
  everyColisInfo,
  everyTravelInfo,
  everyReservationInfo,
  countReservation,
  countNotifs,
  everyNotifInfo,
  //deleteUserbyID,
  countTransaction,
  dataTravel,
  dataReservation,
  deleteUser,
  getUserByTel,
  countStatistics,
  countStatisticsByCompany,
  rankingCompany,
  getTravelsByUser,
  StatsDetail,
  getStats,
  afficherDernierCodeEnregistre,
  everyReservationInfoTelCode,
  everyTravelInfoTelCode,
  everyColisInfoTelCode,

} = require('../Controllers/User');

// Routes pour les utilisateurs
router.post('/register', UserModels);
router.post('/login', userLogin);
router.put('/users/:id/updateName', modifyUserName);
router.put('/users/:id/updatePassword', modifyUserPassword);
router.post('/users/RequestUser', makeDeletionRequest);
router.post('/users/forgot', ForgotPassword);
router.get('/users/:id', getUserById);
router.get('/countUsers', countUsers);
router.get('/everyUserInfo', everyUserInfo);

// DISPLAY TRANSCATION BY TEL AND CODE
router.get('/everyReservationInfoTelCode/:tel/:code', everyReservationInfoTelCode);
router.get('/everyTravelInfoTelCode/:tel/:code', everyTravelInfoTelCode);
router.get('/everyColisInfoTelCode/:tel/:code', everyColisInfoTelCode);

// DISPLAY TRANSCATION BY TEL 

router.get('/everyReservationInfoTel/:tel', everyReservationInfoTel);
router.get('/everyTravelInfoTel/:tel', everyTravelInfoTel);
router.get('/everyColisInfoTel/:tel', everyColisInfoTel);

// DISPLAY TRANSCATION WITHOUT TEL
router.get('/everyColisInfo', everyColisInfo);
router.get('/everyTravelInfo', everyTravelInfo);
router.get('/everyReservationInfo', everyReservationInfo);

/////////////////////////////////////////////////////////////////
router.get('/countReservation', countReservation);
router.get('/countNotifs', countNotifs);
router.get('/countTransaction', countTransaction);
router.get('/rankingCompany', rankingCompany);
router.get('/everyNotifInfo', everyNotifInfo);
router.get('/dataTravel/:year?', dataTravel);
router.get('/dataReservation/:year?', dataReservation);
router.delete('/deleteUser', deleteUser);
router.get('/statistics', countStatistics);


///////////////////////////////////////////////////////////////// DISPLAY STATISTIQUES PAR JOUR, SEMAINES,ANNEES

router.get('/getStats', StatsDetail);
router.get('/stats', getStats);


// Routes pour les paiements de voyage
router.post('/Travel', createTravel);
router.post('/LoginPass', loginPass);
router.get('/users/travels/:userId',  getTravelsByUser);
router.get('/companyStatistics',  countStatisticsByCompany)

// Routes pour les paiements de colis
router.post('/Colis', createColis);

// Routes pour les réservations
router.post('/reservation', Reservation);

// Routes pour afficher dernier code généré

router.get('/lastcode', afficherDernierCodeEnregistre)

module.exports = router;
