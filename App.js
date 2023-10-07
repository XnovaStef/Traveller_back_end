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
const ForgotPassword  = require('../xnova_back_end/routes/UserRoute')


const app = express();

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
app.use('/api', userLogin);
app.use('/api',registerCompany);
app.use('/api',loginCompany);
app.use('/api',modifyUserName);
app.use('/api',modifyUserPassword);
app.use('/api',modifyCompanyName);
app.use('/api',modifyCompanyEmail);
app.use('/api', modifyCompanyPassword);
app.use('/api',  makeDeletionRequest);
app.use('/api', companyDeletionRequest);
app.use('/api', ForgotPassword );

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
