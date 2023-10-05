const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModels'); // Assuming this is the correct path to your User model
const RequestDeleteUser = require('../models/RequestModels')

// Define a route for user registration
exports.UserModels = async (req, res) => {
  try {
    // Extract user data from the request body
    const { pseudo, residence, occupation, tel, password } = req.body;

    // Check if a user with the same phone number already exists
    const existingUser = await User.findOne({ tel });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Create a new user document
    const newUser = new User({
      pseudo,
      residence,
      occupation,
      tel,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user to the database
    await newUser.save();

    // Create and send a JWT token for authentication
    const token = jwt.sign({ userId: newUser._id }, 'your-secret-key'); // Replace with your secret key
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.userLogin = async (req, res) => {
  try {
    // Extract user data from the request body
    const { tel, password } = req.body;

    // Check if a user with the provided phone number exists
    const user = await User.findOne({ tel });

    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // If the phone number and password are valid, create and send a JWT token for authentication
    const token = jwt.sign({ userId: user._id }, 'mySecretKey', { expiresIn: '15m' }); // Replace with your secret key
    res.status(200).json({ message: 'Login successful', token ,  userId: user._id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.modifyUserName = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'a pas été trouvé" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    if (req.body.pseudo != null) {
      user.pseudo = req.body.pseudo;
    }
    
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.modifyUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'a pas été trouvé" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    if (req.body.pseudo != null) {
      user.pseudo = req.body.pseudo;
    }
    
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.modifyUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'a pas été trouvé" });
    }

    // Check if the user provided the current password in the request
    if (!req.body.currentPassword) {
      return res.status(400).json({ message: "Veuillez fournir le mot de passe actuel." });
    }

    // Verify the provided current password against the stored hash
    const validCurrentPassword = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!validCurrentPassword) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect.' });
    }

    // Update the password with the new one
    if (req.body.newPassword) {
      // Hash the new password before saving it
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.makeDeletionRequest = async (req, res) => {
  try {

    // Extract email and password from the request body
    const { tel, password } = req.body;

    // Check if a company with the provided email exists
    const user = await User.findOne({ tel });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    // Check if the user provided the current password in the request
    if (!password) {
      return res.status(400).json({ message: "Veuillez fournir le mot de passe actuel." });
    }

    // Verify the provided password against the stored hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Create a deletion request object
    const deletionRequest = new RequestDeleteUser({
      tel: req.body.tel, // Use the provided telephone number from the request
      password: user.password, // You may want to hash this password for security.
      pattern: req.body.pattern, // Include any other relevant data for the deletion request.
    });

    // Save the deletion request
    const savedRequest = await deletionRequest.save();

    res.json(savedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


