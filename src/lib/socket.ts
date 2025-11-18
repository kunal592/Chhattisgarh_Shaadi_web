import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth';

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://chhattisgarhshadi-backend.onrender.com';

let socket: Socket;

export const initiateSocketConnection = () => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    console.log('Connecting to socket...');
    socket = io(URL, {
      transports: ['websocket'],
      auth: {
        token: accessToken,
      },
    });

    socket.on('connect', () => {
      console.log('Successfully connected to socket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    // Add other event listeners here as needed (e.g., for messages, notifications)

  } else {
    console.log('No access token found, socket connection not initiated.');
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => socket; // Export a function to get the socket instance
