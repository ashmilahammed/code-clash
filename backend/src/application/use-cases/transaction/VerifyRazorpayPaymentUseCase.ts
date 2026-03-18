import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IPlanRepository } from "../../../domain/repositories/plan/IPlanRepository";
import { IRazorpayService } from "../../../domain/services/IRazorpayService";
import { Transaction } from "../../../domain/entities/transaction/Transaction";
import { INotificationRepository } from "../../../domain/repositories/notification/INotificationRepository";
import { IBadgeRewardService } from "../../../domain/services/IBadgeRewardService";
import { Badge } from "../../../domain/entities/badge/Badge";

import { VerifyPaymentDTO } from "../../dto/transaction/VerifyPaymentDTO";


export class VerifyRazorpayPaymentUseCase {
    constructor(
        private readonly _transactionRepository: ITransactionRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _planRepository: IPlanRepository,
        private readonly _razorpayService: IRazorpayService,
        private readonly _notificationRepository: INotificationRepository,
        private readonly _badgeRewardService: IBadgeRewardService
    ) { }

    async execute(dto: VerifyPaymentDTO): Promise<Transaction> {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userId, planId } = dto;

        // Verify Payment Signature
        const isValid = this._razorpayService.verifyPaymentSignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        if (!isValid) {
            throw new Error("Invalid payment signature");
        }

        // Fetch Plan to define amount
        const plan = await this._planRepository.findById(planId);
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

        const createdTransaction = await this._transactionRepository.create(transaction);

        // Update User Premium Status
        const user = await this._userRepository.findById(userId);
        if (user) {
            user.is_premium = true;
            user.premium_expiry_notification_sent = false;

            const now = new Date();
            let baseDate = now;

            //if already have plan, extend date
            if (user.premium_expiry_date && user.premium_expiry_date > now) {
                baseDate = new Date(user.premium_expiry_date);
            }

            user.premium_expiry_date = new Date(baseDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

            await this._userRepository.save(user);

            // Send Notification
            const featuresList = plan.features.join(", ");
            await this._notificationRepository.createNotification({
                title: "👑 Premium Activated!",
                message: `${featuresList}.`,
                recipientType: "individual",
                recipientId: userId,
                senderId: "000000000000000000000000", // System ID
            });

            // Automatic Badge Rewards(premium)
            await this._badgeRewardService.checkAndReward(user, Badge.REQUIREMENT_TYPES.PREMIUM_UPGRADED, 1);
        } else {
            throw new Error("User not found after successful payment");
        }

        return createdTransaction;
    }
}
