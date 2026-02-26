import { UserModel } from "../../database/models/user/UserModel";
import { WinstonLogger } from "../logger";

const logger = new WinstonLogger();

export const startPremiumExpirationJob = () => {
    // Run every 1 hour: 1000 * 60 * 60
    const CHECK_INTERVAL = 1000 * 60 * 60;

    logger.info("Premium Expiration Scheduler started.");

    const expirePremiumUsers = async () => {
        try {
            const result = await UserModel.updateMany(
                {
                    is_premium: true,
                    premium_expiry_date: { $lt: new Date() }
                },
                {
                    $set: { is_premium: false, premium_expiry_date: null }
                }
            );

            if (result.modifiedCount > 0) {
                logger.info(`Expired premium status for ${result.modifiedCount} users.`);
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
