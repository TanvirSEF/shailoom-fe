import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (token: string, role: string) => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setAuth: (token, role) => set({ token, role, isAuthenticated: true }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      logout: () => set({ token: null, role: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
);
