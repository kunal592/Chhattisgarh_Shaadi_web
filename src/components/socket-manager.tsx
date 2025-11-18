'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { initiateSocketConnection, disconnectSocket } from '@/lib/socket';

export default function SocketManager() {
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      initiateSocketConnection();
    }

    return () => {
      disconnectSocket();
    };
  }, [accessToken]);

  return null; // This component does not render anything
}
