import { IConversationRepository } from "../../../../domain/repositories/chat/IConversationRepository";
import { AdminGroupQueryDTO } from "../../../dto/chat/AdminGroupQueryDTO";
import { IGetAdminGroupsUseCase } from "../../../interfaces/chat/admin/IGetAdminGroupsUseCase";

export class GetAdminGroupsUseCase implements IGetAdminGroupsUseCase {
    constructor(
        private readonly _conversationRepository: IConversationRepository
    ) { }

    async execute(dto: AdminGroupQueryDTO) {
        const { page, limit, search } = dto;

        // return this._conversationRepository.findAdminGroups(page, limit, search);
        const result = await this._conversationRepository.findAdminGroups(page, limit, search);

        const totalPages = Math.ceil(result.total / limit);

        return {
            groups: result.data,
            total: result.total,
            totalPages
        };
    }
}
