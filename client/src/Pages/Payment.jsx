import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PaymentPage() {
  const location = useLocation();
  const { name, email, roomType, checkInDate, checkOutDate, price } =
    location.state || {};
  console.log(
    'PAYMENT:',
    name,
    email,
    roomType,
    checkInDate,
    checkOutDate,
    price
  );
  const [cardNo, setCardNo] = useState('');
  const [cvv, setCvv] = useState('');
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!cardNo || !cvv) {
      alert('Please enter card details.');
      return;
    }

    // Payment request payload
    const paymentData = {
      name,
      email,
      card_no: cardNo,
      cvv,
      price,
      // roomType,
      // checkInDate,
      // checkOutDate,
    };

    try {
      // First POST request to process the payment
      const paymentResponse = await fetch(
        'http://localhost:3000/api/payment/makePayment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData),
        }
      );

      if (!paymentResponse.ok)
        throw new Error('Payment failed. Please try again.');

      const paymentResult = await paymentResponse.json();
      const transactionId = paymentResult.transaction_id;

      console.log('Payment successful. Transaction ID:', transactionId);
      const RoomMap = { single: 1, couple: 2 };
      // Second POST request to confirm booking
      const bookingData = {
        customer_name: name,
        customer_email: email,
        transaction_id: transactionId,
        room_type: RoomMap[roomType],
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      };
      console.log(bookingData);

      const bookingResponse = await fetch(
        'http://100.64.238.95:8080/api/book/createBooking',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        }
      );

      if (!bookingResponse.ok)
        throw new Error('Booking confirmation failed. Please try again.');

      const bookingResult = await bookingResponse.json();
      const { booking_id, room_no } = bookingResult;

      alert(
        `Booking successful! Booking ID: ${booking_id}, Room Number: ${room_no}`
      );

      // Redirect to ListBookings page on success
      navigate('/listBookings', { state: { email } });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="payment-page">
      <h2>Payment Page</h2>
      <p>Amount to Pay: ${price}</p>
      <div>
        <label>Card Number:</label>
        <input
          type="text"
          value={cardNo}
          onChange={(e) => setCardNo(e.target.value)}
          placeholder="Enter card number"
        />
      </div>
      <div>
        <label>CVV:</label>
        <input
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="Enter CVV"
        />
      </div>
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
}

export default PaymentPage;
