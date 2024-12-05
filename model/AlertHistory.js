// models/AlertHistory.js

import mongoose from 'mongoose';

const alertHistorySchema = new mongoose.Schema({
  recipientEmail: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set the current date and time
  },
  status: {
    type: String,
    enum: ['Succeeded', 'Failed'],
    required: true,
  },
  alertType: {
    type: String,
    required: true,
  }
});

// Export the model
const AlertHistory = mongoose.model('AlertHistory', alertHistorySchema);
export { AlertHistory };
