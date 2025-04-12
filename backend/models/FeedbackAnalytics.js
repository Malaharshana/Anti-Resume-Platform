const mongoose = require('mongoose');

const feedbackAnalyticsSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }, // Link to candidate
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }, // Link to challenge
  averageRating: { type: Number, default: 0 }, // Store average rating
  totalFeedbackCount: { type: Number, default: 0 }, // Total feedback received
  feedbackTrends: [
    {
      date: { type: Date, default: Date.now }, // Store date of feedback
      rating: Number,
      comment: String,
    },
  ],
});

// Add indexes for fast searching
feedbackAnalyticsSchema.index({ candidateId: 1, challengeId: 1 });

// Middleware to update the average rating and feedback count after each new feedback
feedbackAnalyticsSchema.methods.updateFeedback = async function (rating, comment) {
  // Push new feedback trend to the list
  this.feedbackTrends.push({ rating, comment });

  // Update total feedback count
  this.totalFeedbackCount += 1;

  // Recalculate the average rating
  const totalRating = this.feedbackTrends.reduce((sum, feedback) => sum + feedback.rating, 0);
  this.averageRating = totalRating / this.totalFeedbackCount;

  // Save the updated analytics
  await this.save();
};

const FeedbackAnalytics = mongoose.model('FeedbackAnalytics', feedbackAnalyticsSchema);

module.exports = FeedbackAnalytics;
