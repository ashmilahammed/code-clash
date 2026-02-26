import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";

export class UpdateGroupStatusUseCase {
    constructor(private conversationRepository: IConversationRepository) { }

    async execute(groupId: string, status: 'active' | 'inactive') {
        const group = await this.conversationRepository.findById(groupId);
        if (!group) throw new Error("Group not found");
        if (group.type !== 'group') throw new Error("Can only update status of groups");

        const updated = await this.conversationRepository.update(groupId, { status });
        if (!updated) throw new Error("Failed to update group status");

        return updated;
    }
}
