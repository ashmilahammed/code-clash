import { create } from "zustand";


interface AuthState {
  user: any;
  accessToken: string | null;
  isAuthenticated: boolean;
  setCredentials: (data: { user: any; accessToken: string }) => void;
  logoutUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setCredentials: ({ user, accessToken }) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
    }),

  logoutUser: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),
}));
