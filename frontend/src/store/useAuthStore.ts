import { create } from "zustand";

const TOKEN_KEY = "investiq_token";

interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: sessionStorage.getItem(TOKEN_KEY),
  setToken: (token) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    set({ token });
  },
  logout: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    set({ token: null });
  },
  isAuthenticated: () => !!get().token,
}));