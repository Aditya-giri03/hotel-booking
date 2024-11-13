const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load the auth proto file
const authProtoPath = path.join(__dirname, 'protos', 'auth.proto');
const authPackageDefinition = protoLoader.loadSync(authProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const authProto = grpc.loadPackageDefinition(authPackageDefinition).auth;

// Load the payment proto file
const paymentProtoPath = path.join(__dirname, 'protos', 'payment.proto');
const paymentPackageDefinition = protoLoader.loadSync(paymentProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const paymentProto = grpc.loadPackageDefinition(
  paymentPackageDefinition
).payment;

// Load the booking proto file
const bookingProtoPath = path.join(__dirname, 'protos', 'booking.proto');
const bookingPackageDefinition = protoLoader.loadSync(bookingProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const bookingProto = grpc.loadPackageDefinition(
  bookingPackageDefinition
).booking;

// Create gRPC clients
const authClient = new authProto.AuthService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);
const paymentClient = new paymentProto.PaymentService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);
const bookingClient = new bookingProto.BookingService(
  '100.64.238.95:50053',
  grpc.credentials.createInsecure()
);

module.exports = {
  authClient,
  paymentClient,
  bookingClient,
};
