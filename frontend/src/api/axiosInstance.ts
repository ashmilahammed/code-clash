import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { refreshTokenApi } from "./authApi";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest: any = err.config;

    if (
      err.response?.status === 403 &&
      (err.response?.data as any)?.code === "ACCOUNT_BLOCKED"
    ) {
      useAuthStore.getState().logoutUser();
      return Promise.reject(err);
    }

    if (
      err.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/auth/refresh-session")
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await refreshTokenApi();
        const newAccessToken = refreshRes.data.data.accessToken;

        //  Only update access token
        useAuthStore.getState().updateAccessToken(newAccessToken);

        // retry original request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch {
        useAuthStore.getState().logoutUser();
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);


export default api;





