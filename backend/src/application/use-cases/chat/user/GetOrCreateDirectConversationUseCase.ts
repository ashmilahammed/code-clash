import { IConversationRepository } from "../../../../domain/repositories/chat/IConversationRepository";
import { Conversation, ConversationType } from "../../../../domain/entities/chat/Conversation";
import { DirectConversationDTO } from "../../../dto/chat/DirectConversationDTO";


export class GetOrCreateDirectConversationUseCase {
    constructor(
        private readonly _conversationRepository: IConversationRepository
    ) { }

    async execute(dto: DirectConversationDTO): Promise<Conversation> {
        const { senderId, receiverId } = dto;

        if (senderId === receiverId) {
            throw new Error("Cannot create a conversation with yourself");
        }

        const participants = [senderId, receiverId].sort();

        // Check if direct conversation already exists
        const existingConversation = await this._conversationRepository.findByParticipants(participants);

        if (existingConversation) {
            return existingConversation;
        }

        // Create a new direct conversation
        const newConversation = new Conversation(
            undefined,
            'direct' as ConversationType,
            participants
        );

        return this._conversationRepository.create(newConversation);
    }
}
