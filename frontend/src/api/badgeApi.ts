import api from "./axiosInstance";
import type { Badge } from "../types/Level";

export const getAllBadges = async (params?: { page: number; limit: number; search?: string }) => {
    const response = await api.get("/badges", { params });
    return response.data.data;
};

export const createBadge = async (data: Partial<Badge> | FormData) => {
    const response = await api.post("/badges", data);
    return response.data.data;
};

export const updateBadge = async (id: string, data: Partial<Badge> | FormData) => {
    const response = await api.patch(`/badges/${id}`, data);
    return response.data.data;
};

export const deleteBadge = async (id: string) => {
    const response = await api.delete(`/badges/${id}`);
    return response.data.data;
};
