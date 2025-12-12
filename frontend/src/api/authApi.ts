import api from "./axiosInstance";

export const loginApi = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const registerApi = (data: { name: string; email: string; password: string }) =>
  api.post("/auth/register", data);

export const logoutApi = () =>
  api.post("/auth/logout");

export const refreshTokenApi = () =>
  api.get("/auth/refresh");
