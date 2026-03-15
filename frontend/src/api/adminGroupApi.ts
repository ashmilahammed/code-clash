import api from "./axiosInstance";
import type { ListQuery } from "../types/ListQuery";


export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface AdminGroup {
    id: string;
    name: string;
    isPrivate: boolean;
    status: 'active' | 'inactive';
    memberCount: number;
    createdAt: string;
}


export const getAdminGroupsApi = async (query: ListQuery): Promise<PaginatedResponse<AdminGroup>> => {
    const res = await api.get("/admin/groups", { params: query });
    return res.data.data;
};

export const updateAdminGroupStatusApi = async (groupId: string, status: 'active' | 'inactive'): Promise<void> => {
    await api.patch(`/admin/groups/${groupId}/status`, { status });
};

export const deleteAdminGroupApi = async (groupId: string): Promise<void> => {
    await api.delete(`/admin/groups/${groupId}`);
};
