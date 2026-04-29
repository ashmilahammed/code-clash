import { Conversation } from "../../../../domain/entities/chat/Conversation";

export interface IJoinGroupUseCase {
  execute(conversationId: string, userId: string): Promise<Conversation>;
}
