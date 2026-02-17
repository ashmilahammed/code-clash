import api from "./axiosInstance";



export const getAllLevels = async () => {
    const response = await api.get("/levels");
    return response.data;
};

export const createLevel = async (data: any) => {
    const response = await api.post("/levels", data);
    return response.data;
};

export const updateLevel = async (id: string, data: any) => {
    const response = await api.patch(`/levels/${id}`, data);
    return response.data;
};

export const deleteLevel = async (id: string) => {
    const response = await api.delete(`/levels/${id}`);
    return response.data;
};
