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

//get paginated users(admin)
export const getUsersApi = async (
    query: ListQuery
): Promise<PaginatedResponse<AdminUser>> => {
    const res = await api.get("/admin/users", {
        params: query,
    });

    // backend already wraps once
    return res.data.data;
};


// update user status(admin)
export const updateUserStatusApi = async (
    userId: string,
    status: UserStatus
): Promise<void> => {
    await api.patch(`/admin/users/${userId}/status`, { status });
};


// --- Group Management ---

export const getAdminGroupsApi = async (
    query: ListQuery
): Promise<PaginatedResponse<AdminGroup>> => {
    const res = await api.get("/admin/groups", { params: query });
    return res.data;
};

export const updateAdminGroupStatusApi = async (
    groupId: string,
    status: 'active' | 'inactive'
): Promise<void> => {
    await api.patch(`/admin/groups/${groupId}/status`, { status });
};

export const deleteAdminGroupApi = async (
    groupId: string
): Promise<void> => {
    await api.delete(`/admin/groups/${groupId}`);
};

// // challenges
// export interface CreateChallengePayload {
//   title: string;
//   description: string;
//   difficulty: "easy" | "medium" | "hard";
//   xpReward: number;
// }

// export const createChallengeApi = async (
//   payload: CreateChallengePayload
// ) => {
//   const res = await api.post("/challenges", payload);
//   return res.data.challenge;
// };