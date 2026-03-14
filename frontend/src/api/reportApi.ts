import axiosInstance from "./axiosInstance";
import type { PaginatedResponse } from "./adminApi";

export interface ReportData {
    messageId: string;
    reason: 'Spam' | 'Abuse' | 'Harassment' | 'Inappropriate' | 'Other';
}

export const reportMessage = async (data: ReportData) => {
    const response = await axiosInstance.post("/reports", data);
    return response.data.data;
};

export const getAllReports = async (query: { page: number; limit: number; status?: string }): Promise<PaginatedResponse<any>> => {
    const response = await axiosInstance.get("/reports/all", { params: query });
    return response.data.data;
};

export const banUser = async (data: { userId: string; days: number; reason: string; reportId?: string }) => {
    const response = await axiosInstance.post("/reports/ban", data);
    return response.data.data;
};

export const dismissReport = async (reportId: string) => {
    const response = await axiosInstance.post(`/reports/dismiss/${reportId}`);
    return response.data.data;
};

export const getReportedMessage = async (messageId: string) => {
    const response = await axiosInstance.get(`/reports/message/${messageId}`);
    return response.data.data;
};
