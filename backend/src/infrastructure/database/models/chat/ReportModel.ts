import { Schema, model, Document, Types } from "mongoose";

export interface IReportDoc extends Document {
    reportedUserId: Types.ObjectId;
    reportedById: Types.ObjectId;
    messageId: Types.ObjectId;
    conversationId: Types.ObjectId;
    reason: 'Spam' | 'Abuse' | 'Harassment' | 'Inappropriate' | 'Other';
    status: 'pending' | 'dismissed' | 'resolved';
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema = new Schema<IReportDoc>(
    {
        reportedUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        reportedById: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true },
        conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
        reason: { 
            type: String, 
            enum: ['Spam', 'Abuse', 'Harassment', 'Inappropriate', 'Other'], 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['pending', 'dismissed', 'resolved'], 
            default: 'pending' 
        }
    },
    { timestamps: true }
);

export const ReportModel = model<IReportDoc>("Report", ReportSchema);
