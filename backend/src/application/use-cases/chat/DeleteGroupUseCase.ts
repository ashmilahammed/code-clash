import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { MessageModel } from "../../../infrastructure/database/models/chat/MessageModel";

export class DeleteGroupUseCase {
    constructor(private conversationRepository: IConversationRepository) { }

    async execute(groupId: string) {
        const group = await this.conversationRepository.findById(groupId);
        if (!group) throw new Error("Group not found");

        // Delete all messages belonging to this group
        await MessageModel.deleteMany({ conversationId: groupId });

        // Delete the group itself
        await this.conversationRepository.delete(groupId);
    }
}
