import { Message } from "../../../../domain/entities/chat/Message";

export interface IGetMessageByIdUseCase {
  execute(messageId: string): Promise<Message | null>;
}
