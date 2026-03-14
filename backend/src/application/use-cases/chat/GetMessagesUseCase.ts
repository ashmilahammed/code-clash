import { IMessageRepository } from "../../../domain/repositories/chat/IMessageRepository";
import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Message } from "../../../domain/entities/chat/Message";
import { GetMessagesQueryDTO } from "../../dto/chat/GetMessagesQueryDTO";

export class GetMessagesUseCase {
    constructor(
        private messageRepository: IMessageRepository,
        private conversationRepository: IConversationRepository
    ) { }

    async execute(dto: GetMessagesQueryDTO): Promise<Message[]> {

        const { conversationId, userId, limit, skip } = dto;

        const conversation = await this.conversationRepository.findById(conversationId);

        if (!conversation) {
            throw new Error("Conversation not found");
        }

        if (!conversation.participants.includes(userId)) {
            throw new Error("User is not a participant in this conversation");
        }

        // Mark read
        await this.messageRepository.markConversationAsRead(conversationId, userId);

        return this.messageRepository.findByConversationId(conversationId, limit, skip);
    }
}
