import { Schema, model, Document, Types } from "mongoose";

export interface IChallengeTestCaseDoc extends Document {
    // challengeId: string;
    challengeId : Types.ObjectId,
    input: string;
    expectedOutput: string;
    isSample: boolean;
}

const ChallengeTestCaseSchema = new Schema<IChallengeTestCaseDoc>({
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge", index: true },
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isSample: { type: Boolean, default: false },
},
    { timestamps: true }
);

export const ChallengeTestCaseModel = model<IChallengeTestCaseDoc>(
    "ChallengeTestCase",
    ChallengeTestCaseSchema
);
