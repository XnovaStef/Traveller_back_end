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
const everyReservationInfo = require('./routes/UserRoute');
const everyTravelInfo = require('./routes/UserRoute');
const everyColisInfo = require('./routes/UserRoute');
const countReservation = require('./routes/UserRoute');
const countNotifs = require('./routes/UserRoute');
const everyNotifInfo = require('./routes/UserRoute');
const deleteUserbyID = require('./routes/UserRoute');
const countTransaction = require('./routes/UserRoute');
const dataTravel = require('./routes/UserRoute');
const dataReservation = require('./routes/UserRoute');
const getTravelInfoByTel = require('./routes/UserRoute');
const getColisInfoByTel = require('./routes/UserRoute');
const getReservInfoByTel = require('./routes/UserRoute');
const countStatistics = require('./routes/UserRoute');
const deleteUser = require('./routes/UserRoute');
const rankingCompany = require('./routes/UserRoute');
const getTravelsByUser = require('./routes/UserRoute');

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
