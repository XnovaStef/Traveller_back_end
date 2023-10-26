const express = require('express');
const router = express.Router();

const {Admin, AdminLogin }  = require('../Controllers/Admin');


router.post('/Admin', Admin);
router.post('/AdminLogin', AdminLogin);

module.exports = router;