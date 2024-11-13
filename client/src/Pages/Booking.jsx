import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BookingPage() {
  //{ name, email }
  const name = 'Aditya';
  const email = 'adgiri3@gmail.com';
  const [roomType, setRoomType] = useState('couple');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [price, setPrice] = useState(0);
  const costPerNight = 1000; // Example cost per night
  const navigate = useNavigate();

  // Calculate days between check-in and check-out
  const calculateDays = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  // Handle booking calculation and popup display
  const handleBookClick = () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select both check-in and check-out dates.');
      return;
    }

    const days = calculateDays(checkInDate, checkOutDate);
    const totalPrice = days * costPerNight;
    setPrice(totalPrice);
    setShowPricePopup(true);
  };

  // Handle popup OK action to navigate to payment page with parameters in state
  const handlePopupOk = () => {
    navigate('/payment', {
      state: {
        name,
        email,
        roomType,
        checkInDate,
        checkOutDate,
        price,
      },
    });
    console.log({
      name,
      email,
      roomType,
      checkInDate,
      checkOutDate,
      price,
    });
    setShowPricePopup(false);
  };

  const handlePopupCancel = () => {
    setRoomType('couple');
    setCheckInDate('');
    setCheckOutDate('');
    setShowPricePopup(false);
  };

  return (
    <div className="booking-page">
      <h2>Booking Page</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={name} disabled />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} disabled />
      </div>
      <div>
        <label>Room Type:</label>
        <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
          <option value="couple">Couple</option>
          <option value="single">Single</option>
        </select>
      </div>
      <div>
        <label>Check-in Date:</label>
        <input
          type="date"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
      </div>
      <div>
        <label>Check-out Date:</label>
        <input
          type="date"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
      </div>
      <button onClick={handleBookClick}>Book</button>

      {showPricePopup && (
        <div className="popup">
          <p>Total Price: ${price}</p>
          <button onClick={handlePopupOk}>OK</button>
          <button onClick={handlePopupCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default BookingPage;
