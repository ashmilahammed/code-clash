import api from "./axiosInstance";

export const getAllBadges = async () => {
    const response = await api.get("/badges");
    return response.data;
};
