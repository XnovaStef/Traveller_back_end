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
  loginPass,
  countUsers

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

// Routes pour les paiements de voyage
router.post('/Travel', createTravel);
router.post('/LoginPass', loginPass);

// Routes pour les paiements de colis


// Routes pour les réservations


module.exports = router;
