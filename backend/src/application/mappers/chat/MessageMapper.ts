import { Types } from "mongoose";
import { Message } from "../../../domain/entities/chat/Message";
import { IMessageDoc } from "../../../infrastructure/database/models/chat/MessageModel";

export class MessageMapper {
    static toDomain(doc: IMessageDoc): Message {
        const isPopulated = doc.senderId && typeof doc.senderId === 'object' && 'username' in doc.senderId;
        const senderDoc = doc.senderId as unknown as { _id: Types.ObjectId; username: string; avatar?: string };
        const senderIdStr = isPopulated ? senderDoc._id.toString() : doc.senderId.toString();

        const sender = isPopulated ? {
            _id: senderDoc._id.toString(),
            username: senderDoc.username,
            ...(senderDoc.avatar !== undefined && { avatar: senderDoc.avatar })
        } : undefined;

        return new Message(
            doc._id.toString(),
            doc.conversationId.toString(),
            senderIdStr,
            doc.content,
            doc.isDeleted,
            doc.messageType,
            doc.mediaUrl,
            doc.readBy.map(userId => userId.toString()),
            doc.createdAt,
            doc.updatedAt,
            sender
        );
    }

    static toPersistence(message: Message) {
        return {
            conversationId: new Types.ObjectId(message.conversationId),
            senderId: new Types.ObjectId(message.senderId),
            content: message.content,
            isDeleted: message.isDeleted,
            messageType: message.messageType,
            mediaUrl: message.mediaUrl,
            readBy: message.readBy.map(id => new Types.ObjectId(id))
        };
    }
}