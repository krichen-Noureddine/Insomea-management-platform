// models/Email.js

const mongoose = require('mongoose');

// Define the schema for the Email model
const emailSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true, // Ensure each email address is unique in the database
    trim: true, // Trim whitespace from the beginning and end of the address
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Email model based on the schema
const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
