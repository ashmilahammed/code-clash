// import { create } from "zustand";

// interface User {
//   id?: string;
//   username: string;
//   email: string;
//   role: "user" | "admin";
// }

// interface AuthState {
//   user: User | null;
//   accessToken: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;

//   setCredentials: (data: { user: User | null; accessToken: string }) => void;
//   logoutUser: () => void;
//   stopLoading: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   accessToken: null,
//   isAuthenticated: false,
//   isLoading: true, //important

//   setCredentials: ({ user, accessToken }) =>
//     set({
//       user,
//       accessToken,
//       isAuthenticated: true,
//       isLoading: false,
//     }),

//   logoutUser: () =>
//     set({
//       user: null,
//       accessToken: null,
//       isAuthenticated: false,
//       isLoading: false,
//     }),

//   stopLoading: () =>
//     set({
//       isLoading: false,
//     }),
// }));



import { create } from "zustand";

interface User {
  id?: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setCredentials: (data: { user: User | null; accessToken: string }) => void;
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
      isAuthenticated : !!user,
      isLoading: false,
    }),

  // for axios refresh
  updateAccessToken: (accessToken) =>
    set((state) => ({
      ...state,
      accessToken,
      // isAuthenticated: true,
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







// import { create } from "zustand";


// interface User {
//   id?: string;
//   username: string;
//   email: string;
//   role: "user" | "admin"; 
// }

// interface AuthState {
//   user: any;
//   accessToken: string | null;
//   isAuthenticated: boolean;

//   setCredentials: (data: { user: any; accessToken: string }) => void;
//   logoutUser: () => void;
// }


// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   accessToken: null,
//   isAuthenticated: false,

//   setCredentials: ({ user, accessToken }) =>
//     set({
//       user,
//       accessToken,
//       isAuthenticated: true,
//     }),

//   logoutUser: () =>
//     set({
//       user: null,
//       accessToken: null,
//       isAuthenticated: false,
//     }),
// }));
