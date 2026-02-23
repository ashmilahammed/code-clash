import { Types } from "mongoose";
import { Conversation, ConversationType } from "../../../domain/entities/chat/Conversation";
import { IConversationDoc } from "../../../infrastructure/database/models/chat/ConversationModel";

export class ConversationMapper {
    static toDomain(doc: IConversationDoc): Conversation {
        return new Conversation(
            doc._id.toString(),
            doc.type as ConversationType,
            doc.participants.map(p => p.toString()),
            doc.adminId ? doc.adminId.toString() : undefined,
            doc.name ?? undefined,
            doc.lastMessageAt,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(conversation: Conversation) {
        return {
            type: conversation.type,
            participants: conversation.participants.map(p => new Types.ObjectId(p)),
            adminId: conversation.adminId ? new Types.ObjectId(conversation.adminId) : null,
            name: conversation.name ?? null,
            lastMessageAt: conversation.lastMessageAt ?? null
        };
    }
}
