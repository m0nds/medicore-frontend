import type { User } from "@/types/user.type";
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  resetAccessToken: () => void;
  resetState: () => void;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      // Kept in memory only — see `partialize` below. The refreshToken is never
      // stored client-side; it lives in an httpOnly cookie owned by the backend.
      accessToken: null,
      isAuthenticated: false,
      setUser: (user: User) => set({ user }),
      resetAccessToken: () => set({ accessToken: null }),
      setAccessToken: (accessToken: string) => set({ accessToken }),
      setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      resetState: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      setAuth: (user: User, accessToken: string) => set({ user, accessToken, isAuthenticated: true }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
      // The accessToken is short-lived and the refreshToken lives in an httpOnly
      // cookie, so neither is persisted here. We only remember who the user is;
      // on reload the first 401 silently refreshes a new accessToken (see
      // service.ts). This keeps the accessToken out of localStorage (XSS-safe).
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
