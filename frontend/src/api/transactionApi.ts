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
