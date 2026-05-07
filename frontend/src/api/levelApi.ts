import api from "./axiosInstance";
import type { Level } from "../types/Level";

export const getAllLevels = async () => {
    const response = await api.get("/levels");
    return response.data.data;
};

export const createLevel = async (data: Partial<Level>) => {
    const response = await api.post("/levels", data);
    return response.data.data;
};

export const updateLevel = async (id: string, data: Partial<Level>) => {
    const response = await api.patch(`/levels/${id}`, data);
    return response.data.data;
};

export const deleteLevel = async (id: string) => {
    const response = await api.delete(`/levels/${id}`);
    return response.data;
};
