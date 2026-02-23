import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Conversation, ConversationType } from "../../../domain/entities/chat/Conversation";



export class GetConversationsUseCase {
    constructor(private conversationRepository: IConversationRepository) { }

    async execute(userId: string): Promise<Conversation[]> {
        return this.conversationRepository.findUserConversations(userId);
    }
}
