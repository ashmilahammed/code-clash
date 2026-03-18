import { IConversationRepository } from "../../../../domain/repositories/chat/IConversationRepository";
import { MessageModel } from "../../../../infrastructure/database/models/chat/MessageModel";

export class DeleteGroupUseCase {
    constructor(
        private readonly _conversationRepository: IConversationRepository
    ) { }

    async execute(groupId: string) {
        
        const group = await this._conversationRepository.findById(groupId);
        if (!group) throw new Error("Group not found");

        // Delete all messages first
        await MessageModel.deleteMany({ conversationId: groupId });

        await this._conversationRepository.delete(groupId);
    }
}
