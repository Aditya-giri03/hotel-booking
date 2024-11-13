const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authClient, paymentClient, bookingClient } = require('./grpcClients');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const CLIENT_ID = 'your_client_id'; // ENTER ORGANISATION ID HERE
const HOTEL_ID = 40; // ENTER ORGANISATION ID HERE
const PAYMENT_ID = 'your_hotel_id'; // ENTER ORGANISATION ID HERE

// REGISTER ROUTES
app.post('/api/register', (req, res) => {
  const { email, password, name, age, gender } = req.body;

  const userData = {
    email,
    password,
    name,
    age,
    gender,
  };

  const signupRequest = {
    client_id: CLIENT_ID,
    user_data: userData,
    primary_key_field: 'email',
  };

  authClient.Signup(signupRequest, (err, response) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send(response.message);
  });
});

// LOGIN ROUTES

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const loginRequest = {
    client_id: CLIENT_ID,
    primary_key_field: 'email',
    primary_key_value: email,
    password,
  };

  authClient.Login(loginRequest, (err, response) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send(response.user_details);
  });
});

// BOOKING ROUTES
const getAvailableRooms = (check_in_date, check_out_date) => {
  console.log('CALLED GRPC AVAILBL ROOM: ', check_in_date, check_out_date);

  const getRoomsRequest = {
    check_in_date,
    check_out_date,
    hotel_id: HOTEL_ID,
  };
  console.log('CALL HOJA', getRoomsRequest);

  let availableRoomResponse;
  bookingClient.GetRooms(getRoomsRequest, (err, response) => {
    if (err) {
      console.log('GIVING ERROR IN GET ROOMS', err);
      return null;
    }
    console.log('NO ERROR IN GET ROOMS', response);
    availableRoomResponse = response;
  });
  console.log('OUTSIDE OF BOOKING CLIENT');

  const availableRoom = availableRoomResponse.rooms.find(
    (room) => room.available
  );
  if (availableRoom) {
    console.log('CALLED GRPC AVAILBL ROOM: ', availableRoom);
    return availableRoom;
  } else {
    return null;
  }
};

app.post('/api/book/createBooking', async (req, res) => {
  const {
    customer_name,
    customer_email,
    transaction_id,
    room_type,
    check_in_date,
    check_out_date,
  } = req.body;
  console.log(req.body);

  // const availableRoom = getAvailableRooms(check_in_date, check_out_date);

  const getRoomsRequest = {
    check_in_date,
    check_out_date,
    hotel_id: HOTEL_ID,
  };
  console.log('CALL HOJA', getRoomsRequest);

  let availableRoomResponse;
  bookingClient.GetRooms(getRoomsRequest, (err, response) => {
    if (err) {
      console.log('GIVING ERROR IN GET ROOMS', err);
      return res.status(400).send('No rooms available');
    }
    console.log('NO ERROR IN GET ROOMS', response);
    availableRoomResponse = response;
  });
  console.log('OUTSIDE OF BOOKING CLIENT');

  const availableRoom = availableRoomResponse.rooms.find(
    (room) => room.available
  );

  console.log('RESPOSNSE OF GETBOOK FUNC:', availableRoom);

  if (availableRoom) {
    console.log('INSIDE IF');
  } else {
    return res.status(400).send('No rooms available');
  }

  const createBookingRequest = {
    customer_name,
    customer_email,
    room_type: RoomMap[room_type],
    check_in_date,
    check_out_date,
    room_id: availableRoom.room_id,
    num_guests: 1,
  };

  bookingClient.CreateBooking(createBookingRequest, (err, response) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send({
      booking_id: response.booking_id,
      room_no: availableRoom.room_no,
    });
  });
});

app.get('/api/book/getAllBookings', (req, res) => {
  const { customer_email } = req.query;

  const listBookingsRequest = {
    customer_email,
    hotel_id: HOTEL_ID,
  };

  bookingClient.ListCustomerBookings(listBookingsRequest, (err, response) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send(response.bookings);
  });
});

// PAYMENT LOGIC
app.post('/api/payment/makePayment', (req, res) => {
  console.log('Calling gRpc Payment Service ');
  const { email, amount, card_number, expiry_date, cvv } = req.body;

  const createPaymentRequest = {
    user_id: email,
    amount,
    currency: 'USD', // Assuming currency is USD, change if needed
    method: 'card', // Assuming method is card, change if needed
  };

  // For testing purposes, we are not calling the gRPC service
  return res
    .status(200)
    .send({ transaction_id: '23453', message: 'Transaction Completed' });

  paymentClient.CreatePayment(createPaymentRequest, (err, response) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send({ payment_id: response.payment_id, message: response.message });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
