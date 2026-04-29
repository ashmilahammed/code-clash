import { IConversationRepository } from "../../../../domain/repositories/chat/IConversationRepository";
import { Conversation } from "../../../../domain/entities/chat/Conversation";

import { IGetPublicConversationsUseCase } from "../../../interfaces/chat/user/IGetPublicConversationsUseCase";

export class GetPublicConversationsUseCase implements IGetPublicConversationsUseCase {
    constructor(
        private readonly _conversationRepository: IConversationRepository
    ) { }

    async execute(): Promise<Conversation[]> {
        return this._conversationRepository.findPublicGroups();
    }
}
