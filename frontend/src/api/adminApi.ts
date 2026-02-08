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
    status: UserStatus;
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







// import api from "./axiosInstance";


// export type UserStatus = "active" | "blocked";

// export interface GetUsersParams {
//     page?: number;
//     limit?: number;
//     status?: UserStatus;
// }

// interface GetUsersResponse {
//     users: {
//         id: string;
//         username: string;
//         email: string;
//         status: UserStatus;
//     }[];
//     total?: number;
//     page?: number;
// }

// export const getUsersApi = async (params: GetUsersParams) => {
//     const res = await api.get("/admin/users", { params });
//     return res.data.data as GetUsersResponse; // unwrap ONCE
// };

// export const updateUserStatusApi = async (
//     userId: string,
//     status: UserStatus
// ) => {
//     const res = await api.patch(`/admin/users/${userId}/status`, { status });
//     return res.data; // message only, no need to unwrap further
// };


