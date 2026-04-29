import { Conversation } from "../../../../domain/entities/chat/Conversation";

export interface IGetPublicConversationsUseCase {
  execute(): Promise<Conversation[]>;
}
