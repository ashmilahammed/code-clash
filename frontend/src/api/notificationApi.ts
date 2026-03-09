import api from "./axiosInstance";

// Admin
export const sendNotificationApi = async (data: {
  title: string;
  message: string;
  recipientType: "all" | "normal" | "premium";
}) => {
  const response = await api.post("/admin/notifications", data);
  return response.data;
};

export const getAdminNotificationHistoryApi = async (page = 1, limit = 10) => {
  const response = await api.get(`/admin/notifications/history?page=${page}&limit=${limit}`);
  return response.data;
};

// User
export const getUserNotificationsApi = async (page = 1, limit = 10) => {
  const response = await api.get(`/user/notifications?page=${page}&limit=${limit}`);
  return response.data;
};

export const markAsReadApi = async (notificationId: string) => {
  const response = await api.patch(`/user/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllAsReadApi = async () => {
  const response = await api.patch("/user/notifications/mark-all-read");
  return response.data;
};

export const clearNotificationsApi = async () => {
  const response = await api.delete("/user/notifications/clear");
  return response.data;
};
