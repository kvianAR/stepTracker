import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  steps: {
    type: Number,
    default: 0,
  },
  goal: {
    type: Number,
    default: 10000,
  },
  goalMet: {
    type: Boolean,
    default: false,
  },
  sleepHours: {
    type: Number,
    default: 0,
  },
  sleepQuality: {
    type: String,
    enum: ['poor', 'fair', 'good', 'excellent'],
    default: 'fair',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure a user can only have one activity entry per date
ActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

// Create the model if it doesn't exist already
const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

export default Activity;