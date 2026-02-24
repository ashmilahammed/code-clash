import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Conversation } from "../../../domain/entities/chat/Conversation";

export class AddParticipantsUseCase {
    constructor(private conversationRepository: IConversationRepository) { }

    async execute(conversationId: string, adderId: string, newParticipantIds: string[]): Promise<Conversation> {
        const conversation = await this.conversationRepository.findById(conversationId);

        if (!conversation) {
            throw new Error("Group not found");
        }

        if (conversation.type !== 'group') {
            throw new Error("Cannot add participants to a direct message conversation");
        }

        // For private groups, maybe only admin can invite, or any member. Let's allow any member for now, 
        // or check if they are in the group.
        if (!conversation.participants.includes(adderId) && conversation.adminId !== adderId) {
            throw new Error("You do not have permission to add participants to this group");
        }

        const currentParticipantsMap = new Map(conversation.participants.map(id => [id.toString(), true]));
        const uniqueNewParticipants = newParticipantIds.filter(id => !currentParticipantsMap.has(id.toString()));

        if (uniqueNewParticipants.length === 0) {
            throw new Error("All provided users are already in the group");
        }

        const updatedParticipants = [...conversation.participants, ...uniqueNewParticipants];

        if (conversation.memberLimit && updatedParticipants.length > conversation.memberLimit) {
            throw new Error(`Adding these users would exceed the group's member limit of ${conversation.memberLimit}`);
        }

        const updatedConversation = await this.conversationRepository.update(conversationId, {
            participants: updatedParticipants
        });

        if (!updatedConversation) {
            throw new Error("Failed to add participants");
        }

        return updatedConversation;
    }
}
