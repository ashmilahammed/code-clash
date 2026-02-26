import { Schema, model, Document, Types } from "mongoose";

export interface IMessageDoc extends Document {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId | any;
    content: string;
    isDeleted: boolean;
    messageType: 'text' | 'image';
    mediaUrl: string | null;
    readBy: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessageDoc>(
    {
        conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: false, default: "" },
        isDeleted: { type: Boolean, default: false },
        messageType: { type: String, enum: ['text', 'image'], default: 'text' },
        mediaUrl: { type: String, default: null },
        readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    { timestamps: true }
);

export const MessageModel = model<IMessageDoc>("Message", MessageSchema);
