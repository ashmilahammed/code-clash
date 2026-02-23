import { IMessageRepository } from "../../../domain/repositories/chat/IMessageRepository";
import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Message } from "../../../domain/entities/chat/Message";


export class GetMessagesUseCase {
    constructor(
        private messageRepository: IMessageRepository,
        private conversationRepository: IConversationRepository
    ) { }

    async execute(conversationId: string, userId: string, limit: number = 50, skip: number = 0): Promise<Message[]> {
        const conversation = await this.conversationRepository.findById(conversationId);

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        if (!conversation.participants.includes(userId)) {
            throw new Error("User is not a participant in this conversation");
        }

        // Mark messages as read by this user
        await this.messageRepository.markConversationAsRead(conversationId, userId);

        return this.messageRepository.findByConversationId(conversationId, limit, skip);
    }
}
