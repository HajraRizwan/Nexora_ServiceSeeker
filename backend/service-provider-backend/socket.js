import { io } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.5:5003'; // Service Provider backend URL

let socket;

export const connectSocket = (userId) => {
  socket = io(SOCKET_URL);

  socket.on('connect', () => {
    console.log('Connected to socket:', socket.id);
    // Join a personal room to receive only your notifications
    socket.emit('joinRoom', userId);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket');
  });
};

export const onBookingUpdate = (callback) => {
  if (!socket) return;
  socket.on('bookingStatusUpdate', (data) => {
    callback(data);
  });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
