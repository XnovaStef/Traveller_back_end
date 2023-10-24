const express = require('express');
const router = express.Router();
const { registerCompany, loginCompany ,modifyCompanyName, modifyCompanyEmail, modifyCompanyPassword, getCompanyById, companyDeletionRequest, ForgotCompanyPassword, countCompany, everyCompanyInfo, deleteCompanybyID   } = require('../Controllers/Compagnie')



router.post('/register1', registerCompany);
router.get('/countCompany', countCompany);
router.post('/login1', loginCompany);
router.put('/companies/:id/updateCompany', modifyCompanyName);
router.put('/companies/:id/updateCompanyEmail', modifyCompanyEmail);
router.put('/companies/:id/updateCompanyPwd', modifyCompanyPassword);
router.post('/companies/RequestCompany', companyDeletionRequest);
router.post('/forgot1', ForgotCompanyPassword  );
router.get('/companies/:id',getCompanyById);
router.get('/everyCompanyInfo', everyCompanyInfo);
router.delete('/deleteCompanybyID/:id?', deleteCompanybyID);


module.exports = router;