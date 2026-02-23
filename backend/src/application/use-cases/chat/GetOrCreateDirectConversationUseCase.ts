import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Conversation, ConversationType } from "../../../domain/entities/chat/Conversation";



export class GetOrCreateDirectConversationUseCase {
    constructor(private conversationRepository: IConversationRepository) { }

    async execute(userId1: string, userId2: string): Promise<Conversation> {
        if (userId1 === userId2) {
            throw new Error("Cannot create a conversation with yourself");
        }

        const participants = [userId1, userId2].sort();

        // Check if direct conversation already exists
        const existingConversation = await this.conversationRepository.findByParticipants(participants);

        if (existingConversation) {
            return existingConversation;
        }

        // Create a new direct conversation
        const newConversation = new Conversation(
            undefined,
            'direct' as ConversationType,
            participants
        );

        return this.conversationRepository.create(newConversation);
    }
}
