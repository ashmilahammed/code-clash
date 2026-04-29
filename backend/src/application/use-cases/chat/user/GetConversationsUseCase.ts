import { IConversationRepository } from "../../../../domain/repositories/chat/IConversationRepository";
import { Conversation, } from "../../../../domain/entities/chat/Conversation";
import { IGetConversationsUseCase } from "../../../interfaces/chat/user/IGetConversationsUseCase";

export class GetConversationsUseCase implements IGetConversationsUseCase {
    constructor(
        private readonly _conversationRepository: IConversationRepository
    ) { }

    async execute(userId: string): Promise<Conversation[]> {
        return this._conversationRepository.findUserConversations(userId);
    }
}
