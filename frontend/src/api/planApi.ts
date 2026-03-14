import axiosInstance from "./axiosInstance";

// Plan Interface
export interface Plan {
    id: string; // From backend's mapper
    name: string;
    description: string;
    price: number;
    duration: number;
    features: string[];
    status: "Active" | "Inactive";
}

// Transaction Interface
export interface Transaction {
    id: string;
    user: { name: string; email: string; avatar: string } | null;
    plan: { name: string } | null;
    amount: number;
    paymentMethod: string;
    status: "Completed" | "Pending" | "Failed";
    date: string;
}


export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}


// Plan APIs
export const getPlansApi = () =>
    axiosInstance.get<ApiResponse<Plan[]>>("/admin/plans");

export const createPlanApi = (data: Partial<Plan>) =>
    axiosInstance.post<ApiResponse<Plan>>("/admin/plans", data);

export const updatePlanApi = (id: string, data: Partial<Plan>) =>
    axiosInstance.put<Plan>(`/admin/plans/${id}`, data);

export const deletePlanApi = (id: string) =>
    axiosInstance.delete(`/admin/plans/${id}`);


// Transaction APIs
// export const getTransactionsApi = () =>
//     axiosInstance.get<Transaction[]>("/admin/transactions");
export const getTransactionsApi = () =>
    axiosInstance.get<ApiResponse<Transaction[]>>("/admin/transactions");


// Public APIs
// export const getPublicPlansApi = () =>
//     axiosInstance.get<ApiResponse<Plan[]>>("/user/plans");

export const getPublicPlansApi = async (): Promise<Plan[]> => {
    const res = await axiosInstance.get("/user/plans");
    return res.data.data;
};