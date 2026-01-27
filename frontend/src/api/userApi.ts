import axiosInstance from "./axiosInstance";


export const getDashboardData = async () => {
  const res = await axiosInstance.get("/user/dashboard");
  return res.data;
};

export const getProfile = async () => {
  const res = await axiosInstance.get("/user/profile");
  return res.data;
};



