import { Conversation } from "../../../../domain/entities/chat/Conversation";

export interface IUpdateGroupStatusUseCase {
  execute(groupId: string, status: "active" | "inactive"): Promise<Conversation>;
}
