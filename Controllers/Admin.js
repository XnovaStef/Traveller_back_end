const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer'); // Import nodemailer
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const Admin = require('../models/AdminModels');
const AdminForgot = require('../models/AdminForgot.Models')

exports.Admin = async (req, res) => {
  try {
    // Extract user data from the request body
    const { email, password } = req.body;

    // Check if a user with the same phone number already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Create a new user document
    const newAdmin = new Admin({
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    await newAdmin.save();

    // Create and send a JWT token for authentication
    const token = jwt.sign({ AdminId: newAdmin._id }, 'your-secret-key'); // Replace with your secret key
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.AdminLogin = async (req, res) => {
  try {
    // Extract user data from the request body
    const { email, password } = req.body;

    // Check if a user with the provided phone number exists
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Email incorrect' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If the phone number and password are valid, create and send a JWT token for authentication
    const token = jwt.sign({ adminId: admin._id }, 'mySecretKey', { expiresIn: '15m' }); // Replace with your secret key
    res.status(200).json({ message: 'Login successful', token ,  adminId: admin._id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.forgotAdmin = async (req, res) => {
  try {
    const { email} = req.body;
    // Check if the user with the provided phone number exists
    const admin = await Admin.findOne({email});
    if (!admin) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Generate a random 6-digit code
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();

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
      text: `Your OTP code is: ${generatedCode}`,
    };

    transporter.sendMail(mailOptions, async (emailErr, info) => {
      if (emailErr) {
        console.error(emailErr);
        return res.status(500).json({ error: 'Failed to send email. Please try again later.' });
      }

      // If the email is sent successfully, proceed with company registration
        // Hash the generated code
    const salt = await bcrypt.genSalt(10);
    const hashedCode = await bcrypt.hash(generatedCode, salt);
       // Update the user's password with the hashed code
    admin.password = hashedCode;
    await admin.save();

    // Record the generated code in the AccountForgot table
    const  adminForgot = new  AdminForgot({
      email: req.body.email,
      code: generatedCode, // Save the generated code in the AccountForgot table
    });
    await adminForgot.save();

    // Generate a JWT token
    const token = jwt.sign({ adminId: admin._id }, 'your-secret-key', {
      expiresIn: '1h', // You can set the expiration time as needed
    });

    res.status(200).json({
      message: 'Code généré et mot de passe utilisateur mis à jour avec succès.',
      token: token, // Include the token in the response
    });
    });


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
