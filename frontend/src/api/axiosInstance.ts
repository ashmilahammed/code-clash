import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { refreshTokenApi } from "./authApi";


// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true,
// });
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});


// req interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// res interceptor
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest: any = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await refreshTokenApi();
        const newAccessToken = res.data.accessToken;

        useAuthStore.getState().setCredentials({
          user: useAuthStore.getState().user!,
          accessToken: newAccessToken,
        });

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (error) {
        useAuthStore.getState().logoutUser();
      }
    }

    return Promise.reject(err);
  }
);

export default api;
