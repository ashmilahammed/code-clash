import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IPlanRepository } from "../../../domain/repositories/plan/IPlanRepository";
import { IRazorpayService } from "../../../domain/services/IRazorpayService";
import { Transaction } from "../../../domain/entities/transaction/Transaction";
import { INotificationRepository } from "../../../domain/repositories/notification/INotificationRepository";

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
        private razorpayService: IRazorpayService,
        private notificationRepository: INotificationRepository
    ) { }

    async execute(dto: VerifyPaymentDTO): Promise<Transaction> {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userId, planId } = dto;

        // Verify Payment Signature
        const isValid = this.razorpayService.verifyPaymentSignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        if (!isValid) {
            throw new Error("Invalid payment signature");
        }

        // Fetch Plan to define amount
        const plan = await this.planRepository.findById(planId);
        if (!plan) {
            throw new Error("Plan not found");
        }

        // Create Transaction Record
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

        // Update User Premium Status
        const user = await this.userRepository.findById(userId);
        if (user) {
            user.is_premium = true;
            user.premium_expiry_notification_sent = false;

            const now = new Date();
            let baseDate = now;

            // If user already has an active premium until a future date, extend from that date.
            if (user.premium_expiry_date && user.premium_expiry_date > now) {
                baseDate = new Date(user.premium_expiry_date);
            }

            user.premium_expiry_date = new Date(baseDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);
            
            await this.userRepository.save(user);

            // Send Notification
            const featuresList = plan.features.join(", ");
            await this.notificationRepository.createNotification({
                title: "👑 Premium Activated!",
                message: `${featuresList}.`,
                recipientType: "individual",
                recipientId: userId,
                senderId: "000000000000000000000000", // System ID
            });
        } else {
            throw new Error("User not found after successful payment");
        }

        return createdTransaction;
    }
}
