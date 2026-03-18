import { IConversationRepository } from "../../../../domain/repositories/chat/IConversationRepository";
import { Conversation, ConversationType } from "../../../../domain/entities/chat/Conversation";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { CreateGroupDTO } from "../../../dto/chat/CreateGroupDTO";



export class CreateGroupUseCase {
    constructor(
        private readonly _conversationRepository: IConversationRepository,
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(dto: CreateGroupDTO): Promise<Conversation> {

        const user = await this._userRepository.findById(dto.adminId);

        if (user && user.isBanned()) {
            const date = user.banned_until?.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            throw new Error(
                `Your account is temporarily banned until ${date}. Reason: ${user.ban_reason}.`
            );
        }

        if (!dto.name || dto.name.trim() === '') {
            throw new Error("Group name is required");
        }

        if (!dto.participants.includes(dto.adminId)) {
            dto.participants.push(dto.adminId);
        }

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

        return this._conversationRepository.create(conversation);
    }
}