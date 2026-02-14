import { Schema, model, Document, Types } from "mongoose";

export type SubmissionStatus =
  | "PASSED"
  | "FAILED"
  | "ERROR";

export interface ISubmissionDoc extends Document {
  userId: Types.ObjectId;
  challengeId: Types.ObjectId;
  language: string;
  code: string;
  finalStatus: SubmissionStatus;
  runtime: number;
  memory: number;
  xpEarned: number;
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmissionDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      index: true,
      required: true,
    },
    language: { type: String, required: true },
    code: { type: String, required: true },
    finalStatus: {
      type: String,
      enum: ["PASSED", "FAILED", "ERROR"],
      required: true,
    },
    runtime: { type: Number, required: true },
    memory: { type: Number, required: true },
    xpEarned: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Helpful compound index for analytics
SubmissionSchema.index({ userId: 1, challengeId: 1 });

export const SubmissionModel = model<ISubmissionDoc>(
  "Submission",
  SubmissionSchema
);
