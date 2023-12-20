const express = require('express');
const router = express.Router();
const {
  registerCompany,
  loginCompany,
  modifyCompanyName,
  modifyCompanyEmail,
  modifyCompanyPassword,
  getCompanyById,
  companyDeletionRequest,
  ForgotCompanyPassword,
  countCompany,
  everyCompanyInfo,
  deleteCompanybyID,
  getAllDestinationTravel,
} = require('../Controllers/Compagnie');

// Routes for Company Management
router.post('/register', registerCompany);
router.get('/countCompany', countCompany);
router.post('/login', loginCompany);
router.put('/companies/:id/updateCompany', modifyCompanyName);
router.put('/companies/:id/updateCompanyEmail', modifyCompanyEmail);
router.put('/companies/:id/updateCompanyPwd', modifyCompanyPassword);
router.post('/companies/RequestCompany', companyDeletionRequest);
router.post('/forgot', ForgotCompanyPassword);
router.get('/companies/:id', getCompanyById);
router.get('/everyCompanyInfo', everyCompanyInfo);
router.delete('/deleteCompanybyID/:id?', deleteCompanybyID);
router.get('/getDestinationTravel', getAllDestinationTravel);

module.exports = router;
