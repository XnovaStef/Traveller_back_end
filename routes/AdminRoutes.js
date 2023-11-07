const express = require('express');
const router = express.Router();

const {Admin, AdminLogin, forgotAdmin} = require('../Controllers/Admin')

router.post('/registerAdmin', Admin);
router.post('/loginAdmin', AdminLogin);
router.post('/forgotAdmin', forgotAdmin);

module.exports = router;