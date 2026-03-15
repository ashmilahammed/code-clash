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



export const getPlansApi = async (): Promise<Plan[]> => {
    const res = await axiosInstance.get("/admin/plans");
    return res.data.data;
};

export const createPlanApi = async (data: Partial<Plan>): Promise<Plan> => {
    const res = await axiosInstance.post("/admin/plans", data);
    return res.data.data;
};

export const updatePlanApi = async (id: string, data: Partial<Plan>): Promise<Plan> => {
    const res = await axiosInstance.put(`/admin/plans/${id}`, data);
    return res.data.data;
};

export const deletePlanApi = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/plans/${id}`);
};

// user plans
export const getPublicPlansApi = async (): Promise<Plan[]> => {
    const res = await axiosInstance.get("/user/plans");
    return res.data.data;
};



