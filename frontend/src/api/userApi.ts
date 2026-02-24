import axiosInstance from "./axiosInstance";
import type { User } from "../types/User";

export const getLeaderboardApi = async (limit = 10): Promise<User[]> => {
  const res = await axiosInstance.get(`/user/leaderboard?limit=${limit}`);
  return res.data.data;
};

export const getDashboardData = async (): Promise<any> => {
  const res = await axiosInstance.get("/user/dashboard");
  return res.data.data;
};

export const getSearchUsersApi = async (): Promise<User[]> => {
  // Using leaderboard as a simple way to get a list of active users to invite
  const res = await axiosInstance.get("/user/leaderboard?limit=100");
  return res.data.data;
};
