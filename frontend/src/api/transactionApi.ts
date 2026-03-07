import axiosInstance from "./axiosInstance";

export const createOrderApi = (planId: string) => {
    return axiosInstance.post<{ id: string; amount: number; currency: string; receipt: string }>(
        "/transactions/create-order",
        { planId }
    );
};

export const verifyPaymentApi = (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    planId: string;
}) => {
    return axiosInstance.post<{ success: boolean; message: string; transaction: any }>(
        "/transactions/verify-payment",
        data
    );
};

export const getMyTransactionsApi = async () => {
    const res = await axiosInstance.get("/transactions/my-history");
    return res.data;
};

export const getCurrentPlanApi = async () => {
    const res = await axiosInstance.get("/transactions/current-plan");
    return res.data;
};
