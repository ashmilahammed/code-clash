import { Request, Response } from "express";
import { GetTransactionsUseCase } from "../../application/use-cases/transaction/GetTransactionsUseCase";
import { CreateRazorpayOrderUseCase } from "../../application/use-cases/transaction/CreateRazorpayOrderUseCase";
import { VerifyRazorpayPaymentUseCase } from "../../application/use-cases/transaction/VerifyRazorpayPaymentUseCase";
// Assume generic logger exists or try to fetch it from DI
import { WinstonLogger } from "../../infrastructure/services/logger";



export class TransactionController {
    constructor(
        private getTransactionsUseCase: GetTransactionsUseCase,
        private createRazorpayOrderUseCase: CreateRazorpayOrderUseCase,
        private verifyRazorpayPaymentUseCase: VerifyRazorpayPaymentUseCase,
        private logger: WinstonLogger
    ) { }

    async getTransactions(req: Request, res: Response) {
        try {
            const transactions = await this.getTransactionsUseCase.execute();
            return res.status(200).json(transactions);
        } catch (error: any) {
            this.logger.error("Error fetching transactions", error);
            return res.status(500).json({ message: "Failed to fetch transactions" });
        }
    }

    async createOrder(req: Request, res: Response) {
        try {
            const { planId } = req.body;
            // Depending on auth implementation, extract user ID from req.user or res.locals
            const userId = res.locals.user?.userId;

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (!planId) {
                return res.status(400).json({ message: "planId is required" });
            }

            const order = await this.createRazorpayOrderUseCase.execute({ planId, userId });
            return res.status(201).json(order);
        } catch (error: any) {
            this.logger.error("Error creating Razorpay order", error);
            return res.status(400).json({ message: error.message || "Failed to create order" });
        }
    }

    async verifyPayment(req: Request, res: Response) {
        try {
            const { razorpayOrderId, razorpayPaymentId, razorpaySignature, planId } = req.body;
            const userId = res.locals.user?.userId;

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !planId) {
                return res.status(400).json({ message: "Missing required payment parameters" });
            }

            const transaction = await this.verifyRazorpayPaymentUseCase.execute({
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature,
                userId,
                planId
            });

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
                transaction
            });
        } catch (error: any) {
            this.logger.error("Error verifying payment", error);
            return res.status(400).json({ success: false, message: error.message || "Failed to verify payment" });
        }
    }
}
