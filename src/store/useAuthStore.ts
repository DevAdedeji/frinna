import { create } from "zustand";
import type { User } from "firebase/auth";

interface AuthState {
    user: User | null;
    isAuthReady: Boolean;
    setUser: (user: User | null) => void;
    setAuthReady: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthReady: false,
    setUser: (user) => set({ user }),
    setAuthReady: () => set({ isAuthReady: true }),
}))