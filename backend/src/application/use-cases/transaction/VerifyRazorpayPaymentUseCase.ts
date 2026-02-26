import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IPlanRepository } from "../../../domain/repositories/plan/IPlanRepository";
import { IRazorpayService } from "../../../domain/services/IRazorpayService";
import { Transaction } from "../../../domain/entities/transaction/Transaction";

interface VerifyPaymentDTO {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    userId: string;
    planId: string;
}

export class VerifyRazorpayPaymentUseCase {
    constructor(
        private transactionRepository: ITransactionRepository,
        private userRepository: IUserRepository,
        private planRepository: IPlanRepository,
        private razorpayService: IRazorpayService
    ) { }

    async execute(dto: VerifyPaymentDTO): Promise<Transaction> {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userId, planId } = dto;

        // 1. Verify Payment Signature
        const isValid = this.razorpayService.verifyPaymentSignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        if (!isValid) {
            throw new Error("Invalid payment signature");
        }

        // 2. Fetch Plan to define amount
        const plan = await this.planRepository.findById(planId);
        if (!plan) {
            throw new Error("Plan not found");
        }

        // 3. Create Transaction Record
        const transaction = new Transaction(
            undefined,
            userId,
            planId,
            plan.price,
            "Razorpay",
            "Completed",
            new Date()
        );

        const createdTransaction = await this.transactionRepository.create(transaction);

        // 4. Update User Premium Status
        const user = await this.userRepository.findById(userId);
        if (user) {
            user.is_premium = true;
            user.premium_expiry_date = new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000);
            await this.userRepository.save(user);
        } else {
            throw new Error("User not found after successful payment");
        }

        return createdTransaction;
    }
}
