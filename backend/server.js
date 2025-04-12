const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Route files
const challengeRoutes = require('./api/challengeRoutes');
const candidateRoutes = require('./api/candidateRoutes');
const authRoutes = require('./api/authRoutes'); // Add auth routes
const matchRoutes = require('./api/matchRoutes');
const companyRoutes = require('./routes/companyRoutes');
const feedbackRoutes = require('./api/feedbackRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/challenges', challengeRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/match', matchRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/feedback', feedbackRoutes); // Ensure this is the only reference to feedback routes
app.use('/api/analytics', analyticsRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Anti-Resume API!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
