import { Types } from "mongoose";
import { Message } from "../../../domain/entities/chat/Message";
import { IMessageDoc } from "../../../infrastructure/database/models/chat/MessageModel";

export class MessageMapper {
    static toDomain(doc: IMessageDoc): Message {
        return new Message(
            doc._id.toString(),
            doc.conversationId.toString(),
            doc.senderId.toString(),
            doc.content,
            doc.readBy.map(userId => userId.toString()),
            doc.createdAt,
            doc.updatedAt
        );
    }

    static toPersistence(message: Message) {
        return {
            conversationId: new Types.ObjectId(message.conversationId),
            senderId: new Types.ObjectId(message.senderId),
            content: message.content,
            readBy: message.readBy.map(id => new Types.ObjectId(id))
        };
    }
}
