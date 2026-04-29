import { Conversation } from "../../../../domain/entities/chat/Conversation";
import { AddParticipantsDTO } from "../../../dto/chat/AddParticipantsDTO";

export interface IAddParticipantsUseCase {
  execute(dto: AddParticipantsDTO): Promise<Conversation>;
}
