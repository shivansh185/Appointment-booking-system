const express = require('express');
const mongoose = require('mongoose');
const Patient=require("./models/patient")
const Appointment=require("./models/appointment")
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/appointmentsDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));



// POST route to book an appointment
app.post('/api/appointments', async (req, res) => {
  const { patientName, doctorName } = req.body;

  try {
    // Check if the patient already exists
    const existingPatient = await Patient.findOne({ patientName, doctorName });

    let discount = 0;
    if (!existingPatient) {
      // If the patient doesn't exist, give a 10% discount
      discount = 10;
    }

    // If the patient exists, set discount to 0
    const walletAmount = existingPatient ? existingPatient.walletAmount : 100; // Assuming initial wallet for new users is $100

    const newAppointment = new Appointment({
      patientName,
      doctorName,
      discount,
      walletAmount: walletAmount - (walletAmount * discount / 100),
    });

    await newAppointment.save();

    // If the patient doesn't exist, create a new patient
    if (!existingPatient) {
      const newPatient = new Patient({ patientName, doctorName, walletAmount });
      await newPatient.save();
    }

    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointmentId: newAppointment._id,
      discount,
      walletAmount: newAppointment.walletAmount,
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

// GET route to fetch appointment details by ID
app.get('/api/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    res.status(500).json({ message: 'Error fetching appointment details' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
