import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function BookingPage() {
  const { name, email } = useContext(AuthContext);

  const [roomType, setRoomType] = useState('couple');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [price, setPrice] = useState(0);
  const costPerNight = 1000;
  const navigate = useNavigate();

  const calculateDays = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const handleBookClick = () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select both check-in and check-out dates.');
      return;
    }

    const RoomMap = { single: 1, couple: 2 };
    const checkAvailability = async () => {
      try {
        const response = await fetch(
          'http://100.64.238.95:8080/api/book/checkAvailable',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              room_type: RoomMap[roomType],
              check_in_date: checkInDate,
              check_out_date: checkOutDate,
            }),
          }
        );

        if (response.status == 500) {
          throw new Error(
            'The selected room type is not available for the chosen dates.'
          );
        }

        const data = await response.json();

        const days = calculateDays(checkInDate, checkOutDate);
        const totalPrice = days * costPerNight;
        setPrice(totalPrice);
        setShowPricePopup(true);
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      }
    };

    checkAvailability();
  };

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
    setShowPricePopup(false);
  };

  const handlePopupCancel = () => {
    setRoomType('couple');
    setCheckInDate('');
    setCheckOutDate('');
    setShowPricePopup(false);
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
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Hotel Booking
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            value={name}
            disabled
            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          >
            <option value="couple">Couple</option>
            <option value="single">Single</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Check-in Date
          </label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Check-out Date
          </label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={handleBookClick}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200"
        >
          Book
        </button>

        {showPricePopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <p className="text-lg font-semibold mb-4">
                Total Price: ${price}
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handlePopupOk}
                  className="py-2 px-4 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition duration-200"
                >
                  OK
                </button>
                <button
                  onClick={handlePopupCancel}
                  className="py-2 px-4 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;
