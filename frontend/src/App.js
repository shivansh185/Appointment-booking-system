// src/App.js

import React, { useState, useEffect } from 'react'; // Import useEffect
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';

// Book Appointment Form Component
function App() {
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const appointment = {
      patientName,
      doctorName,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/appointments', appointment);
      navigate(`/appointment/${response.data.appointmentId}`);
    } catch (error) {
      console.error('Error booking appointment', error);
    }
  };

  return (
    <div>
      <h1>Book Appointment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Patient Name: </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Doctor Name: </label>
          <input
            type="text"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

// Appointment Details Component
function AppointmentDetails() {
  const { id } = useParams(); // Use useParams to get the appointment ID from the URL
  const [appointment, setAppointment] = useState(null);

  useEffect(() => { // Use useEffect to fetch appointment details when the component mounts
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/appointments/${id}`);
        setAppointment(response.data);
      } catch (error) {
        console.error('Error fetching appointment details', error);
      }
    };
    fetchAppointmentDetails();
  }, [id]); // Run this effect only when the id changes

  if (!appointment) return <p>Loading...</p>;

  return (
    <div>
      <h2>Appointment Details</h2>
      <p>Patient Name: {appointment.patientName}</p>
      <p>Doctor Name: {appointment.doctorName}</p>
      <p>Discount: {appointment.discount}%</p>
      <p>Wallet Amount: ${appointment.walletAmount}</p>
    </div>
  );
}

// App Router Configuration
function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/appointment/:id" element={<AppointmentDetails />} />
      </Routes>
    </Router>
  );
}

export default MainApp;
