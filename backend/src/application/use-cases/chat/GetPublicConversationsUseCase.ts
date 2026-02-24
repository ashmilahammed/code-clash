import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Conversation } from "../../../domain/entities/chat/Conversation";

export class GetPublicConversationsUseCase {
    constructor(private conversationRepository: IConversationRepository) { }

    async execute(): Promise<Conversation[]> {
        return this.conversationRepository.findPublicGroups();
    }
}
