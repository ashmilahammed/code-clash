import { Schema, model, Document, Types } from "mongoose";

export interface ITransactionDoc extends Document {
    userId: Types.ObjectId;
    planId: Types.ObjectId;
    amount: number;
    paymentMethod: string;
    status: 'Completed' | 'Pending' | 'Failed';
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<ITransactionDoc>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
        amount: { type: Number, required: true },
        paymentMethod: { type: String, required: true },
        status: { type: String, enum: ['Completed', 'Pending', 'Failed'], required: true },
        date: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export const TransactionModel = model<ITransactionDoc>("Transaction", TransactionSchema);
