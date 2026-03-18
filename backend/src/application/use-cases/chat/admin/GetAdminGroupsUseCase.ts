import { IConversationRepository } from "../../../../domain/repositories/chat/IConversationRepository";
import { AdminGroupQueryDTO } from "../../../dto/chat/AdminGroupQueryDTO";

export class GetAdminGroupsUseCase {
    constructor(
        private readonly _conversationRepository: IConversationRepository
    ) { }

    async execute(dto: AdminGroupQueryDTO) {
        const { page, limit, search } = dto;

        return this._conversationRepository.findAdminGroups(page, limit, search);
    }
}
