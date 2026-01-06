import api from "./axiosInstance";

export type UserStatus = "active" | "blocked";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  status?: UserStatus;
}

interface GetUsersResponse {
  users: {
    id: string;
    username: string;
    email: string;
    status: UserStatus;
  }[];
  total?: number;
  page?: number;
}

export const getUsersApi = async (params: GetUsersParams) => {
  const res = await api.get("/admin/users", { params });
  return res.data.data as GetUsersResponse; // unwrap ONCE
};

export const updateUserStatusApi = async (
  userId: string,
  status: UserStatus
) => {
  const res = await api.patch(`/admin/users/${userId}/status`, { status });
  return res.data; // message only, no need to unwrap further
};




// import api from "./axiosInstance";


// export type UserStatus = "active" | "blocked";

// export interface GetUsersParams {
//     page?: number;
//     limit?: number;
//     status?: UserStatus;
// }

// export const getUsersApi = (params: GetUsersParams) =>
//     api.get("/admin/users", { params });

// export const updateUserStatusApi = (userId: string, status: UserStatus) =>
//     api.patch(`/admin/users/${userId}/status`, { status });


