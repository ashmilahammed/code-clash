import { UserModel } from "../../database/models/user/UserModel";
import { WinstonLogger } from "../logger";
import { NotificationRepository } from "../../repositories/notification/NotificationRepository";
// import mongoose from "mongoose";

const logger = new WinstonLogger();
const notificationRepository = new NotificationRepository();

export const startPremiumExpirationJob = () => {
    // Run every 1 hour: 1000 * 60 * 60
    const CHECK_INTERVAL = 1000 * 60 * 60;

    logger.info("Premium Expiration Scheduler started.");

    const expirePremiumUsers = async () => {
        try {
            // Expire users whose time is up
            const expirationResult = await UserModel.updateMany(
                {
                    is_premium: true,
                    premium_expiry_date: { $lt: new Date() }
                },
                {
                    $set: { is_premium: false, premium_expiry_date: null, premium_expiry_notification_sent: false }
                }
            );

            if (expirationResult.modifiedCount > 0) {
                logger.info(`Expired premium status for ${expirationResult.modifiedCount} users.`);
            }

            // Send notification for users expiring in 3 days
            const threeDaysFromNow = new Date();
            threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

            const expiringUsers = await UserModel.find({
                is_premium: true,
                premium_expiry_notification_sent: false,
                premium_expiry_date: { $lte: threeDaysFromNow, $gt: new Date() }
            });

            for (const user of expiringUsers) {
                await notificationRepository.createNotification({
                    title: "⏳ Your premium plan expires in 3 days.",
                    message: "Renew now to keep premium benefits.",
                    recipientType: "individual",
                    recipientId: user._id.toString(),
                    senderId: "000000000000000000000000", // System ID
                });

                user.premium_expiry_notification_sent = true;
                await user.save();
                logger.info(`Sent premium expiry notification to user: ${user.username}`);
            }

        } catch (error) {
            logger.error("Error running Premium Expiration Job", error);
        }
    };

    // Run periodically
    setInterval(expirePremiumUsers, CHECK_INTERVAL);

    // Also run immediately on startup
    expirePremiumUsers();
};
