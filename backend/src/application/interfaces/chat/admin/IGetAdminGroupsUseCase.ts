import { AdminGroupQueryDTO } from "../../../dto/chat/AdminGroupQueryDTO";
import { Conversation } from "../../../../domain/entities/chat/Conversation";

export interface IGetAdminGroupsUseCase {
  execute(dto: AdminGroupQueryDTO): Promise<{
    groups: Conversation[];
    total: number;
    totalPages: number;
  }>;
}
