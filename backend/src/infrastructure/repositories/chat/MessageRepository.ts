import { IMessageRepository } from "../../../domain/repositories/chat/IMessageRepository";
import { Message } from "../../../domain/entities/chat/Message";
import { MessageModel } from "../../database/models/chat/MessageModel";
import { MessageMapper } from "../../../application/mappers/chat/MessageMapper";
import { Types } from "mongoose";

export class MessageRepository implements IMessageRepository {
    async findById(id: string): Promise<Message | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const doc = await MessageModel.findById(id);
        return doc ? MessageMapper.toDomain(doc) : null;
    }

    async findByConversationId(conversationId: string, limit = 50, skip = 0): Promise<Message[]> {
        if (!Types.ObjectId.isValid(conversationId)) return [];

        const docs = await MessageModel.find({ conversationId: new Types.ObjectId(conversationId) })
            .populate('senderId', 'username profilePic')
            .sort({ createdAt: -1 }) // get newest first
            .skip(skip)
            .limit(limit);

        // Reverse to return in chronological order
        return docs.reverse().map(MessageMapper.toDomain);
    }

    async create(message: Message): Promise<Message> {
        const persistenceData = MessageMapper.toPersistence(message);
        const created = await MessageModel.create(persistenceData);
        await created.populate('senderId', 'username profilePic');
        return MessageMapper.toDomain(created);
    }

    async update(message: Message): Promise<Message> {
        if (!message.id || !Types.ObjectId.isValid(message.id)) throw new Error('Invalid message id');
        const persistenceData = MessageMapper.toPersistence(message);
        const updated = await MessageModel.findByIdAndUpdate(message.id, persistenceData, { new: true });
        if (!updated) throw new Error('Message not found');
        await updated.populate('senderId', 'username profilePic');
        return MessageMapper.toDomain(updated);
    }

    async markAsRead(messageId: string, userId: string): Promise<void> {
        if (!Types.ObjectId.isValid(messageId) || !Types.ObjectId.isValid(userId)) return;

        await MessageModel.findByIdAndUpdate(
            messageId,
            { $addToSet: { readBy: new Types.ObjectId(userId) } }
        );
    }

    async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
        if (!Types.ObjectId.isValid(conversationId) || !Types.ObjectId.isValid(userId)) return;

        await MessageModel.updateMany(
            {
                conversationId: new Types.ObjectId(conversationId),
                readBy: { $ne: new Types.ObjectId(userId) }
            },
            { $addToSet: { readBy: new Types.ObjectId(userId) } }
        );
    }
}
