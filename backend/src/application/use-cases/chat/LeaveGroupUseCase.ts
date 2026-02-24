import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Conversation } from "../../../domain/entities/chat/Conversation";

export class LeaveGroupUseCase {
    constructor(private conversationRepository: IConversationRepository) { }

    async execute(conversationId: string, userId: string): Promise<Conversation> {
        const conversation = await this.conversationRepository.findById(conversationId);

        if (!conversation) {
            throw new Error("Group not found");
        }

        if (conversation.type !== 'group') {
            throw new Error("Cannot leave a direct message conversation");
        }

        if (!conversation.participants.includes(userId)) {
            throw new Error("User is not a member of this group");
        }

        const updatedParticipants = conversation.participants.filter(id => id.toString() !== userId.toString());

        const updatedConversation = await this.conversationRepository.update(conversationId, {
            participants: updatedParticipants
        });

        if (!updatedConversation) {
            throw new Error("Failed to leave group");
        }

        return updatedConversation;
    }
}
