import { Conversation } from "../../../../domain/entities/chat/Conversation";
import { DirectConversationDTO } from "../../../dto/chat/DirectConversationDTO";

export interface IGetOrCreateDirectConversationUseCase {
  execute(dto: DirectConversationDTO): Promise<Conversation>;
}
