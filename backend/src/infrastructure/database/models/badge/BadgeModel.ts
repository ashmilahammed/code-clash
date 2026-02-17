import { Schema, model, Document } from "mongoose";


export interface IBadgeDoc extends Document {
    name: string;
    description: string;
    icon: string; // URL or icon name
    minXpRequired: number; // Optional
    createdAt: Date;
    updatedAt: Date;
}

const BadgeSchema = new Schema<IBadgeDoc>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
        minXpRequired: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const BadgeModel = model<IBadgeDoc>("Badge", BadgeSchema);
