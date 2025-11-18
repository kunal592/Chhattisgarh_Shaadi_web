import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/lib/types';
import api from '@/lib/api';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: ({ accessToken, refreshToken, user }: { accessToken: string; refreshToken: string; user: User }) => void;
  logout: () => Promise<void>;
  setAccessToken: (token: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: ({ accessToken, refreshToken, user }) =>
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        }),
      logout: async () => {
        const { refreshToken } = get();
        if (refreshToken) {
          try {
            await api.post('/auth/logout', { refreshToken });
          } catch (error) {
            console.error('Failed to logout from the backend', error);
          }
        }
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
      setAccessToken: (token) => set({ accessToken: token }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
