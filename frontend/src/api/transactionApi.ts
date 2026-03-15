import axiosInstance from "./axiosInstance";

// Transaction Interface
export interface Transaction {
    id: string;
    user: { name: string; email: string; avatar: string } | null;
    plan: { name: string } | null;
    amount: number;
    paymentMethod: string;
    status: "Completed" | "Pending" | "Failed";
    date: string;
}


// Transaction api - admin
export const getAdminTransactionsApi = async (): Promise<Transaction[]> => {
    const res = await axiosInstance.get("/admin/transactions");
    return res.data.data;
};


export const createOrderApi = async (planId: string) => {
    const res = await axiosInstance.post("/transactions/create-order", { planId });
    return res.data.data;
};

export const verifyPaymentApi = async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    planId: string;
}) => {
    const res = await axiosInstance.post("/transactions/verify-payment", data);
    return res.data.data;
};


export const getMyTransactionsApi = async (page = 1, limit = 10) => {
    const res = await axiosInstance.get(`/transactions/my-history?page=${page}&limit=${limit}`);
    return res.data.data;
};


export const getCurrentPlanApi = async () => {
    const res = await axiosInstance.get("/transactions/current-plan");
    return res.data.data;
};



