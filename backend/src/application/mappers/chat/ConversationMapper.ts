import { Types } from "mongoose";
import {
    Conversation,
    // ConversationType
} from "../../../domain/entities/chat/Conversation";
import { IConversationDoc } from "../../../infrastructure/database/models/chat/ConversationModel";

export class ConversationMapper {
    static toDomain(doc: IConversationDoc): Conversation {
        const isPopulated = doc.participants && doc.participants.length > 0 && typeof doc.participants[0] === 'object';
        
        const participantDetails = isPopulated ? (doc.participants as any[]).map(p => ({
            id: p._id.toString(),
            username: p.username,
            avatar: p.avatar
        })) : undefined;

        const participantIds = isPopulated 
            ? (doc.participants as any[]).map(p => p._id.toString())
            : doc.participants.map(p => p.toString());

        return new Conversation(
            doc._id.toString(),
            doc.type as 'direct' | 'group',
            participantIds,
            doc.adminId?.toString(),
            doc.name,
            doc.description,
            doc.memberLimit,
            doc.isPrivate,
            doc.status,
            doc.lastMessageAt,
            doc.createdAt,
            doc.updatedAt,
            participantDetails
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