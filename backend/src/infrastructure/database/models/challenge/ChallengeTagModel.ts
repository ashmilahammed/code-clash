import { Schema, model, Document } from "mongoose";

export interface IChallengeTagDoc extends Document {
    name: string;
}

const ChallengeTagSchema = new Schema<IChallengeTagDoc>({
    name: { type: String, unique: true, required: true },
},
    { timestamps: true }
);

export const ChallengeTagModel = model<IChallengeTagDoc>(
    "ChallengeTag",
    ChallengeTagSchema
);
