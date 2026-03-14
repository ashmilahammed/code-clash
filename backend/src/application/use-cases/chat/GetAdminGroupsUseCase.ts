import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { AdminGroupQueryDTO } from "../../dto/chat/AdminGroupQueryDTO";

export class GetAdminGroupsUseCase {
    constructor(private conversationRepository: IConversationRepository) { }

    async execute(dto: AdminGroupQueryDTO) {
        const { page, limit, search } = dto;

        return this.conversationRepository.findAdminGroups(page, limit, search);
    }
}
