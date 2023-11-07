const express = require('express');
const mongoose = require('mongoose');
const UserModels = require('./routes/UserRoute');
const userLogin = require('../xnova_back_end/routes/UserRoute')
const registerCompany = require('../xnova_back_end/routes/CompanyRoutes')
const loginCompany = require('../xnova_back_end/routes/CompanyRoutes')
const modifyUserName = require('../xnova_back_end/routes/UserRoute')
const modifyUserPassword = require('../xnova_back_end/routes/UserRoute')
const modifyCompanyName = require('../xnova_back_end/routes/CompanyRoutes')
const modifyCompanyEmail = require('../xnova_back_end/routes/CompanyRoutes')
const modifyCompanyPassword = require('../xnova_back_end/routes/CompanyRoutes')
const makeDeletionRequest = require('../xnova_back_end/routes/UserRoute')
const companyDeletionRequest = require('../xnova_back_end/routes/CompanyRoutes')
const ForgotPassword  = require('../xnova_back_end/routes/UserRoute');
const ForgotCompanyPassword  = require('../xnova_back_end/routes/CompanyRoutes')
const createTravel = require('../xnova_back_end/routes/UserRoute')
const createColis = require('../xnova_back_end/routes/UserRoute')
const loginPass = require('../xnova_back_end/routes/UserRoute')
const countUsers = require('../xnova_back_end/routes/UserRoute')
const countCompany = require('../xnova_back_end/routes/CompanyRoutes')
const Reservation = require('../xnova_back_end/routes/UserRoute')
const cors = require('cors'); 
const everyUserInfo = require('../xnova_back_end/routes/UserRoute');
const everyCompanyInfo = require('../xnova_back_end/routes/CompanyRoutes');
const everyReservationInfo = require('../xnova_back_end/routes/UserRoute');
const everyTravelInfo = require('../xnova_back_end/routes/UserRoute');
const everyColisInfo = require('../xnova_back_end/routes/UserRoute');
const countReservation = require('../xnova_back_end/routes/UserRoute');
const countNotifs = require('../xnova_back_end/routes/UserRoute');
const everyNotifInfo = require('../xnova_back_end/routes/UserRoute');
const deleteUserbyID = require('../xnova_back_end/routes/UserRoute');
const deleteCompanybyID = require('../xnova_back_end/routes/CompanyRoutes');
const countTransaction = require('../xnova_back_end/routes/UserRoute');
const dataTravel = require('../xnova_back_end/routes/UserRoute');
const Admin = require('../xnova_back_end/routes/AdminRoutes')
const forgotAdmin = require('../xnova_back_end/routes/AdminRoutes')
const AdminLogin = require('../xnova_back_end/routes/AdminRoutes');
const getAllDestinationTravel = require('../xnova_back_end/routes/CompanyRoutes');
//const { getAllDestinationTravel } = require('./Controllers/Compagnie');
const   getTravelInfoByTel = require('../xnova_back_end/routes/UserRoute');
const   getColisInfoByTel = require('../xnova_back_end/routes/UserRoute');
const   getReservInfoByTel = require('../xnova_back_end/routes/UserRoute');
//const  getUserByTel = require('../xnova_back_end/routes/UserRoute');





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
app.use('/api', UserModels);
app.use('/api', countUsers);
app.use('/api', everyUserInfo);
app.use('/api', userLogin);
app.use('/api', forgotAdmin );
app.use('/api',registerCompany);
app.use('/api', countCompany);
app.use('/api', everyCompanyInfo);
app.use('/api', getAllDestinationTravel);
app.use('/api/company',loginCompany);
app.use('/api',modifyUserName);
app.use('/api',modifyUserPassword);
app.use('/api',modifyCompanyName);
app.use('/api',modifyCompanyEmail);
app.use('/api', modifyCompanyPassword);
app.use('/api',  makeDeletionRequest);
app.use('/api', companyDeletionRequest);
app.use('/api', ForgotPassword );
app.use('/api', ForgotCompanyPassword  );
app.use('/api/user', createTravel  );
app.use('/api/user', createColis);
app.use('/api/user', loginPass  );
app.use('/api/user', Reservation  );
app.use('/api', everyReservationInfo);
app.use('/api', everyTravelInfo);
app.use('/api', everyColisInfo);
app.use('/api', countReservation);
app.use('/api', countNotifs);
app.use('/api', countTransaction);
app.use('/api', everyNotifInfo);
app.use('/api', deleteUserbyID);
app.use('/api', deleteCompanybyID);
app.use('/api', dataTravel);
app.use('/api/', Admin);
app.use('/api', AdminLogin);
app.use('/api', getTravelInfoByTel );
app.use('/api', getColisInfoByTel );
app.use('/api', getReservInfoByTel );
//app.use('/api',  getUserByTel );


// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
