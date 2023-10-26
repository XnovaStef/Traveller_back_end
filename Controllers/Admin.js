const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/AdminModels')

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