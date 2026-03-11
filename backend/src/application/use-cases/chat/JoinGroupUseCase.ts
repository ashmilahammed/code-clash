import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Conversation } from "../../../domain/entities/chat/Conversation";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IBadgeRewardService } from "../../../domain/services/IBadgeRewardService";
import { Badge } from "../../../domain/entities/badge/Badge";



export class JoinGroupUseCase {
    constructor(
        private conversationRepository: IConversationRepository,
        private userRepository: IUserRepository,
        private badgeRewardService: IBadgeRewardService
    ) { }

    async execute(conversationId: string, userId: string): Promise<Conversation> {
        const user = await this.userRepository.findById(userId);
        if (user && user.isBanned()) {
            const date = user.banned_until?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
            throw new Error(`Your account is temporarily banned until ${date}. Reason: ${user.ban_reason}.`);
        }

        const conversation = await this.conversationRepository.findById(conversationId);

        if (!conversation) {
            throw new Error("Group not found");
        }

        if (conversation.type !== 'group') {
            throw new Error("Cannot join a direct message conversation");
        }

        if (conversation.participants.includes(userId)) {
            throw new Error("User is already a member of this group");
        }

        const updatedParticipants = [...conversation.participants, userId];

        const updatedConversation = await this.conversationRepository.update(conversationId, {
            participants: updatedParticipants
        });

        if (!updatedConversation) {
            throw new Error("Failed to join group");
        }

        // Automatic Badge Rewards - COMMUNITY
        const memberGroupsCount = await this.conversationRepository.countUserGroups(userId);
        if (user) {
            await this.badgeRewardService.checkAndReward(user, Badge.REQUIREMENT_TYPES.GROUP_JOINED, memberGroupsCount);
        }

        return updatedConversation;
    }
}
