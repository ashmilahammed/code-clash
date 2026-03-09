import { IMessageRepository } from "../../../domain/repositories/chat/IMessageRepository";
import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Message } from "../../../domain/entities/chat/Message";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";



interface SendMessageDto {
    conversationId: string;
    senderId: string;
    content: string;
    messageType?: 'text' | 'image';
    mediaUrl?: string | null;
}

export class SendMessageUseCase {
    constructor(
        private messageRepository: IMessageRepository,
        private conversationRepository: IConversationRepository,
        private userRepository: IUserRepository
    ) { }

    async execute(dto: SendMessageDto): Promise<Message> {
        const user = await this.userRepository.findById(dto.senderId);
        if (user && user.isBanned()) {
            const date = user.banned_until?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
            throw new Error(`Your account is temporarily banned until ${date}. Reason: ${user.ban_reason}.`);
        }

        const conversation = await this.conversationRepository.findById(dto.conversationId);

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        if (!conversation.participants.includes(dto.senderId)) {
            throw new Error("User is not a participant in this conversation");
        }

        const message = new Message(
            undefined,
            dto.conversationId,
            dto.senderId,
            dto.content,
            false,
            dto.messageType || 'text',
            dto.mediaUrl || null,
            [dto.senderId] // sender has read it
        );

        const createdMessage = await this.messageRepository.create(message);

        // Update conversation lastMessageAt
        if (createdMessage.createdAt) {
            await this.conversationRepository.updateLastMessage(dto.conversationId, createdMessage.createdAt);
        } else {
            await this.conversationRepository.updateLastMessage(dto.conversationId, new Date());
        }

        return createdMessage;
    }
}
