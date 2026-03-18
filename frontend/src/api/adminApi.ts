import api from "./axiosInstance";
import type { ListQuery } from "../types/ListQuery";


//types
export type UserStatus = "active" | "blocked";

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface AdminUser {
    id: string;
    username: string;
    email: string;
    avatar: string | null;
    status: UserStatus;
}

export interface AdminGroup {
    id: string;
    name: string;
    isPrivate: boolean;
    status: 'active' | 'inactive';
    memberCount: number;
    createdAt: string;
}

//get paginated users
export const getUsersApi = async (query: ListQuery): Promise<PaginatedResponse<AdminUser>> => {
    const res = await api.get("/admin/users", { params: query, });

    return res.data.data;
};


//
export const updateUserStatusApi = async (userId: string, status: UserStatus): Promise<void> => {
    await api.patch(`/admin/users/${userId}/status`, { status });
};


//dashboard
export const getAdminDashboardStatsApi = async (range: string = '30days') => {
    return await api.get("/admin/dashboard/stats", { params: { range } });
};

