import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (status: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setUser: (user) => set(() => ({ user })),
      setIsAuthenticated: (status) => set(() => ({ isAuthenticated: status })),
      logout: () => set(() => ({ isAuthenticated: false, user: null })),
    }),
    {
      name: "auth-storage", 
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;