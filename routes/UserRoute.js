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
  everyReservationInfo,
  everyTravelInfo,
  everyColisInfo,
  countReservation,
  countNotifs,
  everyNotifInfo,
  //deleteUserbyID,
  countTransaction,
  dataTravel,
  dataReservation,
  getTravelInfoByTel,
  getColisInfoByTel,
  getReservInfoByTel,
  deleteUser,
  getUserByTel,
  countStatistics,
  countStatisticsByCompany,
  rankingCompany,
  getTravelsByUser

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
router.get('/everyReservationInfo', everyReservationInfo);
router.get('/everyTravelInfo', everyTravelInfo);
router.get('/everyColisInfo', everyColisInfo);
router.get('/countReservation', countReservation);
router.get('/countNotifs', countNotifs);
router.get('/countTransaction', countTransaction);
router.get('/rankingCompany', rankingCompany);
router.get('/everyNotifInfo', everyNotifInfo);
router.get('/dataTravel/:year?', dataTravel);
router.get('/dataReservation/:year?', dataReservation);
router.delete('/deleteUser', deleteUser);
router.get('/statistics', countStatistics);




// Routes pour les paiements de voyage
router.post('/Travel', createTravel);
router.post('/LoginPass', loginPass);
router.get('/getTravelInfoTel', getTravelInfoByTel);
router.get('/getColisInfoTel', getColisInfoByTel);
router.get('/getReservInfoTel', getReservInfoByTel);
router.get('/users/travels/:userId',  getTravelsByUser);
router.get('/companyStatistics',  countStatisticsByCompany)

// Routes pour les paiements de colis
router.post('/Colis', createColis);

// Routes pour les réservations
router.post('/reservation', Reservation);

module.exports = router;
