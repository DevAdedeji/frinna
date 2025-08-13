import { create } from "zustand";
import type { User } from "firebase/auth";

interface AuthState {
    user: User | null;
    isLoading: Boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: Boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    setUser: (user) => set({ user, isLoading: false }),
    setLoading: (loading) => set({ isLoading: loading }),
}))