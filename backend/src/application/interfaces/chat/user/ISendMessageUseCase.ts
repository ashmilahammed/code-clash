import { Message } from "../../../../domain/entities/chat/Message";
import { SendMessageDTO } from "../../../dto/chat/SendMessageDTO";

export interface ISendMessageUseCase {
  execute(dto: SendMessageDTO): Promise<Message>;
}
