import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Conversation, ConversationType } from "../../../domain/entities/chat/Conversation";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";


interface CreateGroupDto {
    adminId: string;
    name: string;
    description?: string;
    memberLimit?: number;
    isPrivate?: boolean;
    participants: string[];
}

export class CreateGroupUseCase {
    constructor(
        private conversationRepository: IConversationRepository,
        private userRepository: IUserRepository
    ) { }

    async execute(dto: CreateGroupDto): Promise<Conversation> {
        const user = await this.userRepository.findById(dto.adminId);
        if (user && user.isBanned()) {
            const date = user.banned_until?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
            throw new Error(`Your account is temporarily banned until ${date}. Reason: ${user.ban_reason}.`);
        }

        if (!dto.name || dto.name.trim() === '') {
            throw new Error("Group name is required");
        }

        if (!dto.participants.includes(dto.adminId)) {
            dto.participants.push(dto.adminId);
        }

        // if (dto.participants.length < 2) {
        //     throw new Error("Group must have at least 2 participants");
        // }

        const conversation = new Conversation(
            undefined,
            'group' as ConversationType,
            dto.participants,
            dto.adminId,
            dto.name,
            dto.description,
            dto.memberLimit,
            dto.isPrivate
        );

        return this.conversationRepository.create(conversation);
    }
}
