import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Conversation } from "../../../domain/entities/chat/Conversation";
import { AddParticipantsDTO } from "../../dto/chat/AddParticipantsDTO";


export class AddParticipantsUseCase {
  constructor(
    private readonly _conversationRepository: IConversationRepository
  ) {}

  async execute(dto: AddParticipantsDTO): Promise<Conversation> {
    const { conversationId, adderId, participants } = dto;

    const conversation =
      await this._conversationRepository.findById(conversationId);

    if (!conversation) {
      throw new Error("GROUP_NOT_FOUND");
    }

    if (conversation.type !== "group") {
      throw new Error("NOT_GROUP_CONVERSATION");
    }

    if (
      !conversation.participants.includes(adderId) &&
      conversation.adminId !== adderId
    ) {
      throw new Error("NO_PERMISSION_TO_ADD_PARTICIPANTS");
    }

    const existingSet = new Set(
      conversation.participants.map((id) => id.toString())
    );

    const uniqueNew = participants.filter(
      (id) => !existingSet.has(id.toString())
    );

    if (uniqueNew.length === 0) {
      throw new Error("ALL_USERS_ALREADY_IN_GROUP");
    }

    const updatedParticipants = [
      ...conversation.participants,
      ...uniqueNew,
    ];

    if (
      conversation.memberLimit &&
      updatedParticipants.length > conversation.memberLimit
    ) {
      throw new Error("GROUP_MEMBER_LIMIT_EXCEEDED");
    }

    const updatedConversation =
      await this._conversationRepository.update(conversationId, {
        participants: updatedParticipants,
      });

    if (!updatedConversation) {
      throw new Error("FAILED_TO_ADD_PARTICIPANTS");
    }

    return updatedConversation;
  }
}