import { Message } from "../../../../domain/entities/chat/Message";

export interface IDeleteMessageUseCase {
  execute(messageId: string, userId: string): Promise<Message>;
}
