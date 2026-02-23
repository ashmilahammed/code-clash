import { Schema, model, Document, Types } from "mongoose";

export interface IConversationDoc extends Document {
    type: 'direct' | 'group';
    participants: Types.ObjectId[];
    adminId?: Types.ObjectId | null;
    name?: string | null;
    lastMessageAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema = new Schema<IConversationDoc>(
    {
        type: { type: String, enum: ['direct', 'group'], required: true },
        participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        adminId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
        name: { type: String, default: null },
        lastMessageAt: { type: Date, default: null }
    },
    { timestamps: true }
);

export const ConversationModel = model<IConversationDoc>("Conversation", ConversationSchema);
