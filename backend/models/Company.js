const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensures unique email
  industry: { type: String },
  cultureMetrics: {
    teamwork: { type: Number },
    growth: { type: Number },
    inclusivity: { type: Number }
  },
  reviews: [{
    reviewer: { type: String },
    comment: { type: String },
    rating: { type: Number }
  }],
  salaryRanges: [{
    role: { type: String },
    minSalary: { type: Number },
    maxSalary: { type: Number },
    currency: { type: String }
  }]
});

// Creating the model
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
