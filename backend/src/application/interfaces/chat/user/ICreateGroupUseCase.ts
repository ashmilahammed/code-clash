import { Conversation } from "../../../../domain/entities/chat/Conversation";
import { CreateGroupDTO } from "../../../dto/chat/CreateGroupDTO";

export interface ICreateGroupUseCase {
  execute(dto: CreateGroupDTO): Promise<Conversation>;
}
