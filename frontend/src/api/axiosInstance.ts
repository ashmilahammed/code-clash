import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { refreshTokenApi } from "./authApi";



const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});


// Res interceptor
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest: any = err.config;

    // If 401 (accessToken expired)
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // new tokens
        const res = await refreshTokenApi();

        const newAccessToken = res.data.accessToken;

        // Update Zustand auth store
        useAuthStore.getState().setCredentials({
          user: useAuthStore.getState().user!, 
          accessToken: newAccessToken,
        });

        
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        // failed request's header
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);

      } catch (error) {
        useAuthStore.getState().logoutUser();
      }
    }

    return Promise.reject(err);
  }
);

export default api;






