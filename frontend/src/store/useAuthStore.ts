import { create } from "zustand";
import type { User } from "../types/User";



interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setCredentials: (data: { user: User; accessToken: string }) => void;
  updateUser: (user: Partial<User>) => void;
  updateAccessToken: (token: string) => void;
  logoutUser: () => void;
  stopLoading: () => void;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  //  login & session restore
  setCredentials: ({ user, accessToken }) =>
    set({
      user,
      accessToken,
      // isAuthenticated: true,
      // isAuthenticated : !!user,
      isAuthenticated: !!accessToken,
      isLoading: false,
    }),

  // update
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),


  // for axios refresh
  updateAccessToken: (accessToken) =>
    set((state) => ({
      ...state,
      accessToken,
      // isAuthenticated: true,
      isAuthenticated: !!accessToken,
    })),

  logoutUser: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  stopLoading: () =>
    set({
      isLoading: false,
    }),


}));










