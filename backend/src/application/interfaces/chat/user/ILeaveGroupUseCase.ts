import { Conversation } from "../../../../domain/entities/chat/Conversation";

export interface ILeaveGroupUseCase {
  execute(conversationId: string, userId: string): Promise<Conversation>;
}
