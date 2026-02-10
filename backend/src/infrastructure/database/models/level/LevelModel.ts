import { Schema, model, Document, Types } from "mongoose";

export interface ILevelDoc extends Document {
  levelNumber: number;
  minXp: number;
  maxXp: number;
  title?: string | null;
  badgeId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const LevelSchema = new Schema<ILevelDoc>(
  {
    levelNumber: { type: Number, required: true, unique: true },
    minXp: { type: Number, required: true },
    maxXp: { type: Number, required: true },
    title: { type: String, default: null },
    badgeId: {
      type: Schema.Types.ObjectId,
      ref: "Badge",
      default: null
    }
  },
  { timestamps: true }
);

export const LevelModel = model<ILevelDoc>("Level", LevelSchema);
