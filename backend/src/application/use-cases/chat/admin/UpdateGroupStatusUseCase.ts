import { IConversationRepository } from "../../../../domain/repositories/chat/IConversationRepository";


export class UpdateGroupStatusUseCase {
    constructor(
        private readonly _conversationRepository: IConversationRepository
    ) { }

    async execute(groupId: string, status: 'active' | 'inactive') {
        const group = await this._conversationRepository.findById(groupId);
        if (!group) throw new Error("Group not found");
        if (group.type !== 'group') throw new Error("Can only update status of groups");

        const updated = await this._conversationRepository.update(groupId, { status });
        if (!updated) throw new Error("Failed to update group status");

        return updated;
    }
}
