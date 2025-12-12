import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { refreshTokenApi } from "./authApi";



const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});


// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest: any = err.config;

    // If 401 (accessToken expired)
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get new tokens
        const res = await refreshTokenApi();

        const newAccessToken = res.data.accessToken;

        // Update Zustand auth store
        useAuthStore.getState().setCredentials({
          user: useAuthStore.getState().user!, // user is already known
          accessToken: newAccessToken,
        });

        // Update Axios default header
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        // Update the failed request's header
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (error) {
        // If refresh also fails → logout user
        useAuthStore.getState().logoutUser();
      }
    }

    return Promise.reject(err);
  }
);

export default api;






