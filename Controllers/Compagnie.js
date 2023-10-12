const express = require('express');
const bcrypt = require('bcryptjs');
const Company = require('../models/CompagnieModels'); // Assuming this is the correct path to your Company model
const RequestDeleteCompany = require('../models/RequestCompModels')
 const nodemailer = require('nodemailer'); // Import nodemailer
 const jwt = require('jsonwebtoken');
 const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define multer disk storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('logo');

// Check file type function
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Seulement des images!');
  }
}

 
exports.registerCompany = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: err });
      }

      const {
        compagnie,
        email,
        destinationTravel,
        tarifTravel,
        gareTravel,
        destinationColis,
        TarifColis,
        gareColis,
        depart,
      } = req.body;

      // Check if a company with the same email already exists
      const existingCompany = await Company.findOne({ email });
      if (existingCompany) {
        return res.status(400).json({ error: 'A company with this email already exists.' });
      }

      // Generate a random digit code (temporary password)
      const digitCode = Math.floor(1000 + Math.random() * 9000).toString();

      // Send the digit code by email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'falletkamagate3@gmail.com',
          pass: 'cptt gtct vqnx onys'
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      const mailOptions = {
        from: 'hello@example.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${digitCode}`,
      };

      transporter.sendMail(mailOptions, async (emailErr, info) => {
        if (emailErr) {
          console.error(emailErr);
          return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
        }

        // If the email is sent successfully, proceed with company registration
        const hashedPassword = await bcrypt.hash(digitCode, 10);
        const newCompany = new Company({
          compagnie,
          email,
          password: hashedPassword, // Use the generated password
          destinationTravel,
          tarifTravel,
          gareTravel,
          destinationColis,
          TarifColis,
          gareColis,
         depart,
          logo: {
            data: fs.readFileSync(path.join(__dirname, "../uploads/" + req.file.filename)),
            contentType: req.file.mimetype,
          },
        });

        try {
          await newCompany.save(); // Use await to save the company
          res.status(201).json({
            message: 'Company registered successfully.',
          });
        } catch (saveErr) {
          console.error(saveErr);
          return res.status(500).json({ error: 'Failed to save company details.' });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};



exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


exports.loginCompany = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if a company with the provided email exists
    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, company.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If the email and password are valid, generate a JWT token
    const token = jwt.sign(
      { companyId: company._id, email: company.email },
      'your-secret-key', // Replace with your own secret key
      { expiresIn: '1h' } // Token expires in 1 hour (you can adjust the expiration time)
    );

    res.status(200).json({ token, companyId: company._id, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.modifyCompanyName = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "La compagnie n'a pas été trouvée" });
    }

    // Extract the password from the request body
    const password = req.body.password;

    // Compare the plain-text password from the request with the stored password
    const passwordMatch = await bcrypt.compare(password, company.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Update the company name if the 'compagnie' field is provided in the request body
    if (req.body.compagnie != null) {
      company.compagnie = req.body.compagnie;
    }
    
    // Save the updated company object to the database
    const updatedCompany = await company.save();

    res.json(updatedCompany);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.modifyCompanyEmail = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "La compagnie n'a pas été trouvée" });
    }

    // Extract the password from the request body
    const password = req.body.password;

    // Compare the plain-text password from the request with the stored password

    const passwordMatch = await bcrypt.compare(password, company.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Check if the new email is provided in the request body
    if (req.body.newEmail != null) {
      // Update the company's email with the new email
      company.email = req.body.newEmail;
    } else {
      return res.status(400).json({ message: 'Nouvel email non fourni.' });
    }

    // Save the updated company object to the database
    const updatedCompany = await company.save();

    res.json(updatedCompany);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.modifyCompanyPassword = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "La compagnie n'a pas été trouvé" });
    }

    // Check if the user provided the current password in the request
    if (!req.body.currentPassword) {
      return res.status(400).json({ message: "Veuillez fournir le mot de passe actuel." });
    }

    // Verify the provided current password against the stored hash
    const validCurrentPassword = await bcrypt.compare(req.body.currentPassword, company.password);

    if (!validCurrentPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Update the password with the new one
    if (req.body.newPassword) {
      // Hash the new password before saving it
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      company.password = hashedPassword;
    }

    const updatedCompany = await company.save();

    res.json(updatedCompany);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.companyDeletionRequest = async (req, res) => {
  try {

    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if a company with the provided email exists
    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    // Check if the user provided the current password in the request
    if (!password) {
      return res.status(400).json({ message: "Veuillez fournir le mot de passe actuel." });
    }

    // Verify the provided password against the stored hash
    const validPassword = await bcrypt.compare(password, company.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Create a deletion request object
    const deletionRequest = new RequestDeleteCompany({
      email: req.body.email, // Use the provided telephone number from the request
      password: company.password, // You may want to hash this password for security.
      pattern: req.body.pattern, // Include any other relevant data for the deletion request.
    });

    // Save the deletion request
    const savedRequest = await deletionRequest.save();

    res.json(savedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



