import { IConversationRepository } from "../../../../domain/repositories/chat/IConversationRepository";
import { Conversation } from "../../../../domain/entities/chat/Conversation";

import { ILeaveGroupUseCase } from "../../../interfaces/chat/user/ILeaveGroupUseCase";


export class LeaveGroupUseCase implements ILeaveGroupUseCase {
    constructor(
        private readonly _conversationRepository: IConversationRepository
    ) { }

    async execute(conversationId: string, userId: string): Promise<Conversation> {

        const conversation = await this._conversationRepository.findById(conversationId);

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

        const updateData: Partial<Conversation> = {
            participants: updatedParticipants
        };

        if (updatedParticipants.length === 0) {
            updateData.status = 'inactive';
            updateData.adminId = null;
        } else if (conversation.adminId === userId) {
            // Admin is leaving, assign new admin from remaining participants
            updateData.adminId = updatedParticipants[0];
        }

        const updatedConversation = await this._conversationRepository.update(conversationId, updateData);

        if (!updatedConversation) {
            throw new Error("Failed to leave group");
        }

        return updatedConversation;
    }
}
