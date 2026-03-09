import axiosInstance from "./axiosInstance";

export interface ReportData {
    messageId: string;
    reason: 'Spam' | 'Abuse' | 'Harassment' | 'Inappropriate' | 'Other';
}

export const reportMessage = async (data: ReportData) => {
    const response = await axiosInstance.post("/reports", data);
    return response.data;
};

export const getAllReports = async () => {
    const response = await axiosInstance.get("/reports/all");
    return response.data;
};

export const banUser = async (data: { userId: string; days: number; reason: string; reportId?: string }) => {
    const response = await axiosInstance.post("/reports/ban", data);
    return response.data;
};

export const dismissReport = async (reportId: string) => {
    const response = await axiosInstance.post(`/reports/dismiss/${reportId}`);
    return response.data;
};

export const getReportedMessage = async (messageId: string) => {
    const response = await axiosInstance.get(`/reports/message/${messageId}`);
    return response.data;
};
