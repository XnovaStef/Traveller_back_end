const express = require('express');
const router = express.Router();

const {Admin, AdminLogin, forgotAdmin} = require('../Controllers/Admin')


//REGISTER COMPANIES

router.post('/registerAdmin', Admin);
router.post('/loginAdmin', AdminLogin);
router.post('/forgotAdmin', forgotAdmin);

//DISPLAY COUNT

module.exports = router;