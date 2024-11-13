import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function ListBooking() {
  const location = useLocation();
  const { email } = location.state || {};
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings?email=${email}`);
        if (!response.ok) throw new Error('Failed to fetch bookings.');

        const bookingData = await response.json();
        setBookings(bookingData);
      } catch (err) {
        setError(err.message);
      }
    };

    if (email) fetchBookings();
  }, [email]);

  return (
    <div className="list-booking-page">
      <h2>Your Bookings</h2>
      {error && <p className="error-message">{error}</p>}
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking.transaction_id} className="booking-card">
            <h3>{booking.name}</h3>
            <p>Room No: {booking.room_no}</p>
            <p>Room Type: {booking.room_type}</p>
            <p>Check-in Date: {booking.checkInDate}</p>
            <p>Check-out Date: {booking.checkOutDate}</p>
            <p>Transaction ID: {booking.transaction_id}</p>
            <p>Price: ${booking.price}</p>
          </div>
        ))
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
}

export default ListBooking;
