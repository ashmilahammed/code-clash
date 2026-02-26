import { Types } from "mongoose";
import { Message } from "../../../domain/entities/chat/Message";
import { IMessageDoc } from "../../../infrastructure/database/models/chat/MessageModel";

export class MessageMapper {
    static toDomain(doc: IMessageDoc): Message {
        const isPopulated = doc.senderId && typeof doc.senderId === 'object' && doc.senderId.username;
        const senderIdStr = isPopulated ? doc.senderId._id.toString() : doc.senderId.toString();

        const sender = isPopulated ? {
            _id: doc.senderId._id.toString(),
            username: doc.senderId.username,
            profilePic: doc.senderId.profilePic
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
