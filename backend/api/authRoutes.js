// backend/api/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');  // Assuming you use 'company.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if company already exists
    let company = await Company.findOne({ email });
    if (company) {
      return res.status(400).json({ message: "Company already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new company
    company = new Company({ name, email, password: hashedPassword });
    await company.save();
    
    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating company" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(400).json({ message: "Company does not exist" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ companyId: company._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
