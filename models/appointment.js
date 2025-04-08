// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  message: String
});

module.exports = mongoose.model('Appointment', appointmentSchema);
