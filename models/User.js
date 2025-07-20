import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password should be at least 8 characters long'],
    select: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalSteps: {
    type: Number,
    default: 0,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  bestStreak: {
    type: Number,
    default: 0,
  },
  goalCompletionRate: {
    type: Number,
    default: 0,
  },
  avgStepsPerDay: {
    type: Number,
    default: 0,
  },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the model if it doesn't exist already
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;