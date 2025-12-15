import api from "./axiosInstance";

export const loginApi = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const registerApi = (data: { username: string; email: string; password: string }) =>
  api.post("/auth/register", data);

export const logoutApi = () =>
  api.post("/auth/logout");

export const refreshTokenApi = () =>
  api.get("/auth/refresh");

export const verifyOtpApi = (data: { userId: string; otp: string }) =>
  api.post("/auth/verify-otp", data);

export const resendOtpApi = (data: { userId: string; ignoreVerified?: boolean }) =>
  api.post("/auth/resend-otp", data);


export const forgotPasswordApi = (data: { email: string }) =>
  api.post("/auth/forgot-password", data);

export const verifyForgotOtpApi = (data: { userId: string; otp: string }) =>
  api.post("/auth/forgot-password/verify-otp", data);

export const resetPasswordApi = (data: { userId: string; password: string }) =>
  api.post("/auth/reset-password", data);


// google
export const googleLoginApi = (data: { googleToken: string }) =>
  api.post("/auth/google", data);
