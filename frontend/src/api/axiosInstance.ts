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
// api.interceptors.response.use(
//   (res) => res,
//   async (err: AxiosError) => {
//     const originalRequest: any = err.config;


//     // handle blocked account
//     if (
//       err.response?.status === 403 &&
//       (err.response.data as any)?.code === "ACCOUNT_BLOCKED"
//     ) {
//       useAuthStore.getState().logoutUser();

//       return Promise.reject(err);
//     }


//     // handle access token expiry
//     if (
//       err.response?.status === 401 &&
//       !originalRequest?._retry &&
//       !originalRequest?.url?.includes("/auth/refresh-session")
//     ) {
//       originalRequest._retry = true;


//       try {
//         const res = await refreshTokenApi();
//         //const newAccessToken = res.data.accessToken;
//         const newAccessToken = res.data.data.accessToken;

//         //  Only update access token
//         // useAuthStore.getState().updateAccessToken(newAccessToken);

//         //
//         const meRes = await api.get("/auth/me");
//         useAuthStore.getState().setCredentials({
//           //user: meRes.data.data.user,
//           user: meRes.data.data.user,
//           accessToken: newAccessToken,
//         });

//         // retry failed request
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         return api(originalRequest);

//       } catch {
//         useAuthStore.getState().logoutUser();
//       }
//     }

//     return Promise.reject(err);
//   }
// );

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest: any = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/auth/refresh-session")
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await refreshTokenApi();
        const newAccessToken = refreshRes.data.data.accessToken;

        // 🔥 Only update access token
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













// import axios, { AxiosError } from "axios";
// import { useAuthStore } from "../store/useAuthStore";
// import { refreshTokenApi } from "./authApi";



// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   withCredentials: true,
// });

// // Req Interceptor
// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().accessToken;

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // Res Interceptor
// // handle expired access token
// api.interceptors.response.use(
//   (res) => res,
//   async (err: AxiosError) => {
//     const originalRequest: any = err.config;

//     //
//     if (err.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const res = await refreshTokenApi();
//         const newAccessToken = res.data.accessToken;

//         //
//         useAuthStore.getState().setCredentials({
//           user: useAuthStore.getState().user!,
//           accessToken: newAccessToken,
//         });

//         api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

//         // failed request header
//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

//         return api(originalRequest);

//       } catch (error) {
//         useAuthStore.getState().logoutUser();
//       }
//     }

//     return Promise.reject(err);
//   }
// );

// export default api;




