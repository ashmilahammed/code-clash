import axiosInstance from "./axiosInstance";
import type { User } from "../types/User";

export const getLeaderboardApi = async (page = 1, limit = 10, search = "", timeframe = "all-time"): Promise<{ data: User[], total: number }> => {
  const res = await axiosInstance.get(`/user/leaderboard?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&timeframe=${timeframe}`);
  return res.data.data;
};

export const getDashboardData = async (): Promise<any> => {
  const res = await axiosInstance.get("/user/dashboard");
  return res.data.data;
};

export const getSearchUsersApi = async (): Promise<User[]> => {
  // Using leaderboard as a simple way to get a list of active users to invite
  const res = await getLeaderboardApi(1, 100);
  return res.data;
};

export const getUserProfileStatsApi = async (userId?: string): Promise<any> => {
  const url = userId ? `/user/profile/stats?userId=${userId}` : "/user/profile/stats";
  const res = await axiosInstance.get(url);
  return res.data.data;
};

export const cancelPremiumApi = async (): Promise<any> => {
  const res = await axiosInstance.put("/user/premium/cancel");
  return res.data;
};

export const updateUserProfileApi = async (data: {
  username?: string;
  about?: string;
  github_url?: string;
  linkedin_url?: string;
}): Promise<any> => {
  const res = await axiosInstance.put("/user/profile", data);
  return res.data.data;
};
