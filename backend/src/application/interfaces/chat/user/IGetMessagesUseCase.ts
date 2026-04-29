import { Message } from "../../../../domain/entities/chat/Message";
import { GetMessagesQueryDTO } from "../../../dto/chat/GetMessagesQueryDTO";

export interface IGetMessagesUseCase {
  execute(dto: GetMessagesQueryDTO): Promise<Message[]>;
}
