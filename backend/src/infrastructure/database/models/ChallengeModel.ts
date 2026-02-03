import mongoose, { Schema, Document } from "mongoose";


export interface IChallengeDoc extends Document {
  title: string;
  description: string;

  difficulty: "easy" | "medium" | "hard";
  domain: "javascript" | "python" | "algorithm" | "database" | "network";

  xpReward: number;
  timeLimitMinutes: number;

  isPremium: boolean;
  starterCode?: string | null;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallengeDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    domain: {
      type: String,
      enum: ["javascript", "python", "algorithm", "database", "network"],
      required: true,
    },

    xpReward: { type: Number, required: true },
    timeLimitMinutes: { type: Number, required: true },

    isPremium: { type: Boolean, default: false },

    starterCode: { type: String, default: null },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ChallengeModel = mongoose.model<IChallengeDoc>(
  "Challenge",
  ChallengeSchema
);
