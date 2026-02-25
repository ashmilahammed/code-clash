import { Schema, model, Document } from "mongoose";

export interface IPlanDoc extends Document {
    name: string;
    description: string;
    price: number;
    duration: number; // in days typically
    features: string[];
    status: 'Active' | 'Inactive';
    createdAt: Date;
    updatedAt: Date;
}

const PlanSchema = new Schema<IPlanDoc>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true, default: "No description" },
        price: { type: Number, required: true },
        duration: { type: Number, required: true },
        features: [{ type: String, required: true }],
        status: { type: String, enum: ['Active', 'Inactive'], required: true, default: 'Active' }
    },
    { timestamps: true }
);

export const PlanModel = model<IPlanDoc>("Plan", PlanSchema);
