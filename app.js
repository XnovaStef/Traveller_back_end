// Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes for User Management
const userRoutes = require('./routes/UserRoute');
const userLogin = require('./routes/UserRoute');
const modifyUserName = require('./routes/UserRoute');
const modifyUserPassword = require('./routes/UserRoute');
const makeDeletionRequest = require('./routes/UserRoute');
const ForgotPassword = require('./routes/UserRoute');
const createTravel = require('./routes/UserRoute');
const createColis = require('./routes/UserRoute');
const loginPass = require('./routes/UserRoute');
const Reservation = require('./routes/UserRoute');
const everyUserInfo = require('./routes/UserRoute');
const everyReservationInfoTel = require('./routes/UserRoute');
const everyTravelInfoTel = require('./routes/UserRoute');
const everyColisInfoTel = require('./routes/UserRoute');
const everyReservationInfoTelCode = require('./routes/UserRoute');
const everyTravelInfoTelCode = require('./routes/UserRoute');
const everyColisInfoTelCode = require('./routes/UserRoute');
const countReservation = require('./routes/UserRoute');
const countNotifs = require('./routes/UserRoute');
const everyNotifInfo = require('./routes/UserRoute');
const deleteUserbyID = require('./routes/UserRoute');
const countTransaction = require('./routes/UserRoute');
const dataTravel = require('./routes/UserRoute');
const dataReservation = require('./routes/UserRoute');
const countStatistics = require('./routes/UserRoute');
const deleteUser = require('./routes/UserRoute');
const rankingCompany = require('./routes/UserRoute');
const getTravelsByUser = require('./routes/UserRoute');
const StatsDetail = require('./routes/UserRoute');
const getStats = require('./routes/UserRoute');
const afficherDernierCodeEnregistre = require('./routes/UserRoute')

// Routes for Company Management
const registerCompany = require('./routes/CompanyRoutes');
const loginCompany = require('./routes/CompanyRoutes');
const modifyCompanyName = require('./routes/CompanyRoutes');
const modifyCompanyEmail = require('./routes/CompanyRoutes');
const modifyCompanyPassword = require('./routes/CompanyRoutes');
const companyDeletionRequest = require('./routes/CompanyRoutes');
const ForgotCompanyPassword = require('./routes/CompanyRoutes');
const countCompany = require('./routes/CompanyRoutes');
const everyCompanyInfo = require('./routes/CompanyRoutes');
const getAllDestinationTravel = require('./routes/CompanyRoutes');
const deleteCompanybyID = require('./routes/CompanyRoutes');
const countStatisticsByCompany = require('./routes/CompanyRoutes');

// Routes for Admin Management
const Admin = require('./routes/AdminRoutes');
const forgotAdmin = require('./routes/AdminRoutes');
const AdminLogin = require('./routes/AdminRoutes');

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
  everyReservationInfoTel,
  everyTravelInfoTel,
  everyColisInfoTel,
  everyReservationInfoTelCode,
  everyTravelInfoTelCode,
  everyColisInfoTelCode,
  countReservation,
  countNotifs,
  everyNotifInfo,
  deleteUserbyID,
  countTransaction,
  dataTravel,
  dataReservation,
  countStatistics,
  deleteUser,
  countStatisticsByCompany,
  rankingCompany,
  getTravelsByUser,
  StatsDetail,
  getStats,
  afficherDernierCodeEnregistre
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



module.exports = app;
