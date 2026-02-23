import { Schema, model, Document, Types } from "mongoose";

export interface IMessageDoc extends Document {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    content: string;
    readBy: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessageDoc>(
    {
        conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    { timestamps: true }
);

export const MessageModel = model<IMessageDoc>("Message", MessageSchema);
