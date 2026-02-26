import { Types } from "mongoose";
import { Conversation, ConversationType } from "../../../domain/entities/chat/Conversation";
import { IConversationDoc } from "../../../infrastructure/database/models/chat/ConversationModel";

export class ConversationMapper {
    static toDomain(doc: IConversationDoc): Conversation {
        return new Conversation(
            doc._id.toString(),
            doc.type as 'direct' | 'group',
            doc.participants.map(p => p.toString()),
            doc.adminId?.toString(),
            doc.name,
            doc.description,
            doc.memberLimit,
            doc.isPrivate,
            doc.status,
            doc.lastMessageAt,
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(entity: Conversation) {
        const doc: any = {
            type: entity.type,
            participants: entity.participants.map(p => new Types.ObjectId(p)),
        };
        if (entity.adminId) doc.adminId = new Types.ObjectId(entity.adminId);
        if (entity.name !== undefined && entity.name !== null) doc.name = entity.name;
        if (entity.description !== undefined && entity.description !== null) doc.description = entity.description;
        if (entity.memberLimit !== undefined && entity.memberLimit !== null) doc.memberLimit = entity.memberLimit;
        if (entity.isPrivate !== undefined && entity.isPrivate !== null) doc.isPrivate = entity.isPrivate;
        if (entity.status) doc.status = entity.status;
        if (entity.lastMessageAt) doc.lastMessageAt = entity.lastMessageAt;
        return doc;
    }
}
