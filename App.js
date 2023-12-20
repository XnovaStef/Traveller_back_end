// Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes for User Management
const userRoutes = require('../xnova_back_end/routes/UserRoute');
const userLogin = require('../xnova_back_end/routes/UserRoute');
const modifyUserName = require('../xnova_back_end/routes/UserRoute');
const modifyUserPassword = require('../xnova_back_end/routes/UserRoute');
const makeDeletionRequest = require('../xnova_back_end/routes/UserRoute');
const ForgotPassword = require('../xnova_back_end/routes/UserRoute');
const createTravel = require('../xnova_back_end/routes/UserRoute');
const createColis = require('../xnova_back_end/routes/UserRoute');
const loginPass = require('../xnova_back_end/routes/UserRoute');
const Reservation = require('../xnova_back_end/routes/UserRoute');
const everyUserInfo = require('../xnova_back_end/routes/UserRoute');
const everyReservationInfo = require('../xnova_back_end/routes/UserRoute');
const everyTravelInfo = require('../xnova_back_end/routes/UserRoute');
const everyColisInfo = require('../xnova_back_end/routes/UserRoute');
const countReservation = require('../xnova_back_end/routes/UserRoute');
const countNotifs = require('../xnova_back_end/routes/UserRoute');
const everyNotifInfo = require('../xnova_back_end/routes/UserRoute');
const deleteUserbyID = require('../xnova_back_end/routes/UserRoute');
const countTransaction = require('../xnova_back_end/routes/UserRoute');
const dataTravel = require('../xnova_back_end/routes/UserRoute');
const dataReservation = require('../xnova_back_end/routes/UserRoute');
const getTravelInfoByTel = require('../xnova_back_end/routes/UserRoute');
const getColisInfoByTel = require('../xnova_back_end/routes/UserRoute');
const getReservInfoByTel = require('../xnova_back_end/routes/UserRoute');
const countStatistics = require('../xnova_back_end/routes/UserRoute');
const deleteUser = require('../xnova_back_end/routes/UserRoute');
const rankingCompany = require('../xnova_back_end/routes/UserRoute');
const getTravelsByUser = require('../xnova_back_end/routes/UserRoute');

// Routes for Company Management
const registerCompany = require('../xnova_back_end/routes/CompanyRoutes');
const loginCompany = require('../xnova_back_end/routes/CompanyRoutes');
const modifyCompanyName = require('../xnova_back_end/routes/CompanyRoutes');
const modifyCompanyEmail = require('../xnova_back_end/routes/CompanyRoutes');
const modifyCompanyPassword = require('../xnova_back_end/routes/CompanyRoutes');
const companyDeletionRequest = require('../xnova_back_end/routes/CompanyRoutes');
const ForgotCompanyPassword = require('../xnova_back_end/routes/CompanyRoutes');
const countCompany = require('../xnova_back_end/routes/CompanyRoutes');
const everyCompanyInfo = require('../xnova_back_end/routes/CompanyRoutes');
const getAllDestinationTravel = require('../xnova_back_end/routes/CompanyRoutes');
const deleteCompanybyID = require('../xnova_back_end/routes/CompanyRoutes');
const countStatisticsByCompany = require('../xnova_back_end/routes/CompanyRoutes');

// Routes for Admin Management
const Admin = require('../xnova_back_end/routes/AdminRoutes');
const forgotAdmin = require('../xnova_back_end/routes/AdminRoutes');
const AdminLogin = require('../xnova_back_end/routes/AdminRoutes');

// Express app setup
const app = express();

// Enable CORS for all routes
app.use(cors());

// Configure Express to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://XNOVA:SqcmEhZU0qKwc9dN@cluster0.bmcdiyt.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

// Define API routes
// User Management
app.use('/api/user', [
  userRoutes,
  userLogin,
  modifyUserName,
  modifyUserPassword,
  makeDeletionRequest,
  ForgotPassword,
  createTravel,
  createColis,
  loginPass,
  Reservation,
  everyUserInfo,
  everyReservationInfo,
  everyTravelInfo,
  everyColisInfo,
  countReservation,
  countNotifs,
  everyNotifInfo,
  deleteUserbyID,
  countTransaction,
  dataTravel,
  dataReservation,
  getTravelInfoByTel,
  getColisInfoByTel,
  getReservInfoByTel,
  countStatistics,
  deleteUser,
  countStatisticsByCompany,
  rankingCompany,
  getTravelsByUser,
]);

// Company Management
app.use('/api/company', [
  registerCompany,
  loginCompany,
  modifyCompanyName,
  modifyCompanyEmail,
  modifyCompanyPassword,
  companyDeletionRequest,
  ForgotCompanyPassword,
  countCompany,
  everyCompanyInfo,
  getAllDestinationTravel,
  deleteCompanybyID,
  countStatisticsByCompany,
]);

// Admin Management
app.use('/api/admin', [Admin, forgotAdmin, AdminLogin]);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
