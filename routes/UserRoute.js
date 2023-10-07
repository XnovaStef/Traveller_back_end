const express = require('express');
const router = express.Router();
const { UserModels, modifyUserName, userLogin, modifyUserPassword, getUserById, makeDeletionRequest, ForgotPassword, getCodeById } = require('../Controllers/User')


router.post('/register', UserModels);
router.post('/login', userLogin);
router.put('/users/:id/updateName', modifyUserName);
router.put('/users/:id/updatePassword', modifyUserPassword);
router.post('/users/RequestUser', makeDeletionRequest);
router.post('/users/forgot', ForgotPassword );
router.get('/users/:id',getUserById);
router.get('/getCode/:id',getCodeById)
module.exports = router;