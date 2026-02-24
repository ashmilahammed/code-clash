import { IConversationRepository } from "../../../domain/repositories/chat/IConversationRepository";
import { Conversation } from "../../../domain/entities/chat/Conversation";
import { ConversationModel } from "../../database/models/chat/ConversationModel";
import { ConversationMapper } from "../../../application/mappers/chat/ConversationMapper";
import { Types } from "mongoose";

export class ConversationRepository implements IConversationRepository {
    async findById(id: string): Promise<Conversation | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        const doc = await ConversationModel.findById(id);
        return doc ? ConversationMapper.toDomain(doc) : null;
    }

    async findByParticipants(participants: string[]): Promise<Conversation | null> {
        // Exact match for participants array regardless of order
        const objectIds = participants.map(p => new Types.ObjectId(p));

        // For direct messages, we look for a conversation with exactly these participants
        const doc = await ConversationModel.findOne({
            type: 'direct',
            participants: {
                $all: objectIds,
                $size: objectIds.length
            }
        });

        return doc ? ConversationMapper.toDomain(doc) : null;
    }

    async findUserConversations(userId: string): Promise<Conversation[]> {
        if (!Types.ObjectId.isValid(userId)) return [];

        const docs = await ConversationModel.find({
            participants: new Types.ObjectId(userId)
        }).sort({ lastMessageAt: -1, updatedAt: -1 });

        return docs.map(ConversationMapper.toDomain);
    }

    async findPublicGroups(): Promise<Conversation[]> {
        const docs = await ConversationModel.find({
            type: 'group',
            isPrivate: false
        }).sort({ createdAt: -1 });

        return docs.map(ConversationMapper.toDomain);
    }

    async create(conversation: Conversation): Promise<Conversation> {
        const persistenceData = ConversationMapper.toPersistence(conversation);
        // const created = await ConversationModel.create(persistenceData);
        // return ConversationMapper.toDomain(created);

        const doc = new ConversationModel(persistenceData);
        const created = await doc.save();

        return ConversationMapper.toDomain(created);
    }

    async update(id: string, data: Partial<Conversation>): Promise<Conversation | null> {
        if (!Types.ObjectId.isValid(id)) return null;

        const updated = await ConversationModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );

        return updated ? ConversationMapper.toDomain(updated) : null;
    }

    async updateLastMessage(id: string, timestamp: Date): Promise<void> {
        if (!Types.ObjectId.isValid(id)) return;
        await ConversationModel.findByIdAndUpdate(id, { $set: { lastMessageAt: timestamp } });
    }
}
