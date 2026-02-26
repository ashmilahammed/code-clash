import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";

export class GetAdminGroupsUseCase {
    constructor(private conversationRepository: IConversationRepository) { }

    async execute(page: number, limit: number, search?: string) {
        return this.conversationRepository.findAdminGroups(page, limit, search);
    }
}
