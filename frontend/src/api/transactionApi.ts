// import axiosInstance from "./axiosInstance";

// export const createOrderApi = (planId: string) => {
//     return axiosInstance.post<{ id: string; amount: number; currency: string; receipt: string }>(
//         "/transactions/create-order",
//         { planId }
//     );
// };

// export const verifyPaymentApi = (data: {
//     razorpayOrderId: string;
//     razorpayPaymentId: string;
//     razorpaySignature: string;
//     planId: string;
// }) => {
//     return axiosInstance.post<{ success: boolean; message: string; transaction: any }>(
//         "/transactions/verify-payment",
//         data
//     );
// };

// export const getMyTransactionsApi = async (page = 1, limit = 10): Promise<{ data: any[], total: number }> => {
//     const res = await axiosInstance.get(`/transactions/my-history?page=${page}&limit=${limit}`);
//     return res.data;
// };

// export const getCurrentPlanApi = async () => {
//     const res = await axiosInstance.get("/transactions/current-plan");
//     return res.data;
// };







import axiosInstance from "./axiosInstance";

export const createOrderApi = async (planId: string) => {
    const res = await axiosInstance.post(
        "/transactions/create-order",
        { planId }
    );

    return res.data.data;   // ⭐ unwrap
};

export const verifyPaymentApi = async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    planId: string;
}) => {
    const res = await axiosInstance.post(
        "/transactions/verify-payment",
        data
    );

    return res.data.data;   // ⭐ unwrap
};

export const getMyTransactionsApi = async (page = 1, limit = 10) => {
    const res = await axiosInstance.get(
        `/transactions/my-history?page=${page}&limit=${limit}`
    );

    return res.data.data;   // ⭐ unwrap
};

export const getCurrentPlanApi = async () => {
    const res = await axiosInstance.get("/transactions/current-plan");
    return res.data.data;   // ⭐ unwrap
};
