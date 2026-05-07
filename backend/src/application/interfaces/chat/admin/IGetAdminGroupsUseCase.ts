import { AdminGroupQueryDTO } from "../../../dto/chat/AdminGroupQueryDTO";
import { IAdminGroupDetail } from "../../../../domain/repositories/chat/IConversationRepository";

export interface IGetAdminGroupsUseCase {
  execute(dto: AdminGroupQueryDTO): Promise<{
    groups: IAdminGroupDetail[];
    total: number;
    totalPages: number;
  }>;
}
