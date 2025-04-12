const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

router.post('/signup', async (req, res) => {
  try {
    const { name, password } = req.body;
    
    // Check if company already exists
    let company = await Company.findOne({ name });
    if (company) {
      return res.status(400).json({ message: "Company already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new company
    company = new Company({ name, password: hashedPassword });
    await company.save();
    
    res.status(201).json({ message: "Company created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating company" });
  }
});

module.exports = router;
