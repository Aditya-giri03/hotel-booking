import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ListBooking() {
  const { email, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `http://100.64.238.95:8080/api/book/getAllBookings?email=${email}`
        );
        if (!response.ok) throw new Error('Failed to fetch bookings.');
        const bookingData = await response.json();
        let bookings = bookingData.bookings;
        bookings.sort((a, b) => b.booking_id - a.booking_id);
        setBookings(bookingData.bookings);
      } catch (err) {
        setError(err.message);
      }
    };

    if (email) fetchBookings();
  }, [email]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">Your Bookings</h1>
        <div>
          <button
            onClick={() => navigate('/booking')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mr-2"
          >
            New Booking
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {error && (
          <p className="text-red-500 font-medium text-center mb-4">{error}</p>
        )}

        {/* {bookings && bookings.length > 0 ? (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.transaction_id}
                className="bg-white shadow-md rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {booking.name}
                </h3>
                <p className="text-gray-600 mt-1">
                  <strong>Room No:</strong> {booking.room_number}
                </p>
                <p className="text-gray-600 mt-1">
                  <strong>Room Type:</strong> {booking.room_type}
                </p>
                <p className="text-gray-600 mt-1">
                  <strong>Check-in Date:</strong> {booking.check_in_date}
                </p>
                <p className="text-gray-600 mt-1">
                  <strong>Check-out Date:</strong> {booking.check_out_date}
                </p>
                <p className="text-gray-600 mt-1">
                  <strong>Transaction ID:</strong> {booking.transaction_id}
                </p>
                <p className="text-gray-600 mt-1">
                  <strong>Booking ID:</strong> {booking.booking_id}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-8">No bookings found.</p>
        )} */}

        {bookings && bookings.length > 0 ? (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.transaction_id}
                className="bg-white shadow-lg rounded-lg p-6 flex items-center"
              >
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                {/* Details Section */}
                <div className="ml-4 w-full">
                  <h3 className="text-xl font-bold text-gray-800">
                    {booking.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-gray-700">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 9H5V7h3V4a1 1 0 011-1h2a1 1 0 011 1v3h3v2h-3v2a1 1 0 01-1 1H9a1 1 0 01-1-1V9z" />
                      </svg>
                      <span>
                        <strong>Room No:</strong> {booking.room_number}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 4a7 7 0 100 14A7 7 0 009 4zM4 8.5a.5.5 0 00-.5-.5H2a.5.5 0 00-.5.5V11a.5.5 0 00.5.5H3.5a.5.5 0 00.5-.5V9H4a.5.5 0 00.5-.5V8.5zM15.5 12.5h-1a.5.5 0 01-.5-.5V9H13a.5.5 0 010-1h2a.5.5 0 01.5.5v3a.5.5 0 01-.5.5zM10 12a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                      <span>
                        <strong>Room Type:</strong> {booking.room_type}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a1 1 0 011-1h6a1 1 0 011 1v12a1 1 0 01-1 1H11a1 1 0 01-1-1V6z" />
                      </svg>
                      <span>
                        <strong>Check-in:</strong> {booking.check_in_date}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a1 1 0 000 2h12a1 1 0 000-2H4zM4 9h12a1 1 0 000-2H4a1 1 0 000 2zM4 14h12a1 1 0 000-2H4a1 1 0 000 2z" />
                      </svg>
                      <span>
                        <strong>Check-out:</strong> {booking.check_out_date}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-purple-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 10a4 4 0 100-8 4 4 0 000 8zM4 11h2v7H4v-7zM14 11a2 2 0 012-2 2 2 0 012 2v4h-2v-4a.5.5 0 10-1 0v4h-2v-4a2 2 0 010-4z" />
                      </svg>
                      <span>
                        <strong>Transaction ID:</strong>{' '}
                        {booking.transaction_id}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.9 4.93A10 10 0 0119 10v1.02a10 10 0 01-5.45 8.52M1 10a9.94 9.94 0 014.53-8.06M10 4v2m0 4v8" />
                      </svg>
                      <span>
                        <strong>Booking ID:</strong> {booking.booking_id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-8">No bookings found.</p>
        )}
      </div>
    </div>
  );
}

export default ListBooking;
