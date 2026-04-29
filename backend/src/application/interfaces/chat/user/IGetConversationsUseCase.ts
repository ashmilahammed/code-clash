import { Conversation } from "../../../../domain/entities/chat/Conversation";

export interface IGetConversationsUseCase {
  execute(userId: string): Promise<Conversation[]>;
}
