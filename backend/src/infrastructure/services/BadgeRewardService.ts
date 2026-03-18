import { IBadgeRewardService } from "../../domain/services/IBadgeRewardService";
import { IBadgeRepository } from "../../domain/repositories/badge/IBadgeRepository";
import { IUserRepository } from "../../domain/repositories/user/IUserRepository";
import { INotificationRepository } from "../../domain/repositories/notification/INotificationRepository";
import { User } from "../../domain/entities/user/User";


export class BadgeRewardService implements IBadgeRewardService {
    constructor(
        private readonly badgeRepo: IBadgeRepository,
        private readonly userRepo: IUserRepository,
        private readonly notificationRepo: INotificationRepository
    ) {}

    async checkAndReward(user: User, type: string, value: number): Promise<string[]> {
        // Find badges of this type
        const eligibleBadges = await this.badgeRepo.findByRequirementType(type);
        
        // Filter badges where requirement value is met
        const badgesToAward = eligibleBadges.filter(badge => 
            value >= badge.requirementValue && !user.hasBadge(badge.id!)
        );

        if (badgesToAward.length === 0) return [];

        const newlyAwardedBadgeNames: string[] = [];

        for (const badge of badgesToAward) {
            user.addBadge(badge.id!);
            newlyAwardedBadgeNames.push(badge.name);

            // Notify user
            await this.notificationRepo.createNotification({
                title: "🎊 New Badge Earned!",
                message: `Congratulations! You've earned the '${badge.name}' badge.`,
                recipientType: "individual",
                recipientId: user.id!,
                senderId: "000000000000000000000000", // System
            });
        }

        // Save user updates (badges)
        await this.userRepo.save(user);

        return newlyAwardedBadgeNames;
    }
}
