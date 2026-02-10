import { Schema, model, Document, Types } from "mongoose";

export interface IChallengeHintDoc extends Document {
  challengeId: Types.ObjectId;   
  order: number;
  content: string;
  unlockAfterMinutes?: number;
}

const ChallengeHintSchema = new Schema<IChallengeHintDoc>({
  challengeId: {
    type: Schema.Types.ObjectId,
    ref: "Challenge",
    index: true,
    required: true,
  },
  order: { type: Number, required: true },
  content: { type: String, required: true },
  unlockAfterMinutes: { type: Number },
});


export const ChallengeHintModel = model<IChallengeHintDoc>(
  "ChallengeHint",
  ChallengeHintSchema
);
