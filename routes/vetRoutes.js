const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');

// POST - Add appointment
router.post('/vet', async (req, res) => {
  try {
    const { name, email, date, message } = req.body;
    const newAppointment = await Appointment.create({ name, email, date, message });
    res.status(201).json({ message: 'Appointment booked successfully!', appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// GET - View all appointments
router.get('/vet', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

module.exports = router;
