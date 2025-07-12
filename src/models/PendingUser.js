const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  Firstname: {
    type: String,
    required: true
  },
  Lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String
  },
  companyName: {
    type: String
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  country: {
    type: String
  },
  newsletter: {
    type: Boolean,
    default: false
  },
  termsAccepted: {
    type: Boolean,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  otpExpiry: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300
  }
});

module.exports = mongoose.models.PendingUser || mongoose.model('PendingUser', pendingUserSchema);
