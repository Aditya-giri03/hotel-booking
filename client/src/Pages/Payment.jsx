import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PaymentPage() {
  const location = useLocation();
  const { name, email, roomType, checkInDate, checkOutDate, price } =
    location.state || {};
  const [cardNo, setCardNo] = useState('');
  const [cvv, setCvv] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!cardNo || !cvv) {
      alert('Please enter card details.');
      return;
    }

    const paymentData = {
      name,
      email,
      card_no: cardNo,
      cvv,
      price,
    };

    try {
      const paymentResponse = await fetch(
        `http://100.64.238.95:8080/api/payment/makePayment`,
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

      const RoomMap = { single: 1, couple: 2 };
      const bookingData = {
        customer_name: name,
        customer_email: email,
        transaction_id: transactionId,
        room_type: RoomMap[roomType],
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      };

      const bookingResponse = await fetch(
        `http://100.64.238.95:8080/api/book/createBooking`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        }
      );

      if (bookingResponse.status === 500) {
        const bookingResult = await bookingResponse.json();
        const msg = bookingResult.msg;
        throw new Error(msg);
      }

      if (!bookingResponse.ok)
        throw new Error('Booking confirmation failed. Please try again.');

      const bookingResult = await bookingResponse.json();

      const { booking_id, room_no } = bookingResult;

      // Set popup data and show popup
      setTransactionId(transactionId);
      setBookingId(booking_id);
      setRoomNo(room_no);
      setShowPopup(true);
    } catch (error) {
      alert(error.message);
      navigate('/booking');
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/listBookings', { state: { email } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate('/listBookings')}
          className="py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200"
        >
          Back to Home
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Complete Your Payment
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          Amount to Pay:{' '}
          <span className="font-bold text-gray-800">${price}</span>
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Card Number</label>
          <input
            type="text"
            value={cardNo}
            onChange={(e) => setCardNo(e.target.value)}
            placeholder="Enter card number"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium">CVV</label>
          <input
            type="password"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="Enter CVV"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          />
        </div>

        <button
          onClick={handlePayment}
          className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200"
        >
          Pay Now
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Payment Successful!
            </h3>
            <p className="text-gray-700 mb-2">
              <strong>Transaction ID:</strong> {transactionId}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Booking ID:</strong> {bookingId}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Room Number:</strong> {roomNo}
            </p>
            <button
              onClick={handlePopupClose}
              className="w-full py-2 mt-4 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
