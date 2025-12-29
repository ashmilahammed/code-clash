import api from "./axiosInstance";


export type UserStatus = "active" | "blocked";

export interface GetUsersParams {
    page?: number;
    limit?: number;
    status?: UserStatus;
}

export const getUsersApi = (params: GetUsersParams) =>
    api.get("/admin/users", { params });

export const updateUserStatusApi = (userId: string, status: UserStatus) =>
    api.patch(`/admin/users/${userId}/status`, { status });






//   export const getUsersApi = (params: any) =>
//   api.get("/admin/users", { params });

// export const updateUserStatusApi = (userId: string, status: string) =>
//   api.patch(`/admin/users/${userId}/status`, { status });