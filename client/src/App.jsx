import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import BookingPage from './Pages/Booking';
import ListBooking from './Pages/ListBookings';
import PaymentPage from './Pages/Payment';
import { AuthProvider } from './context/AuthContext';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/listBookings" element={<ListBooking />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
