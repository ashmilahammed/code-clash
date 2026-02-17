import api from "./axiosInstance";

export const getAllBadges = async () => {
    const response = await api.get("/badges");
    return response.data;
};

export const createBadge = async (data: any) => {
    const response = await api.post("/badges", data);
    return response.data;
};

export const updateBadge = async (id: string, data: any) => {
    const response = await api.patch(`/badges/${id}`, data);
    return response.data;
};

export const deleteBadge = async (id: string) => {
    const response = await api.delete(`/badges/${id}`);
    return response.data;
};
