import { Schema, model, Document, Types } from "mongoose";

export interface IChallengeCodeTemplateDoc extends Document {
  challengeId: Types.ObjectId;
  language: string;
  starterCode: string;
  solutionCode: string;
}


const ChallengeCodeTemplateSchema = new Schema<IChallengeCodeTemplateDoc>({
  challengeId: { type: Schema.Types.ObjectId, ref: "Challenge", index: true },
  language: { type: String, required: true },
  starterCode: { type: String, required: true },
  solutionCode: { type: String, required: true },
});


//compound unique index
ChallengeCodeTemplateSchema.index(
  { challengeId: 1, language: 1 },
  { unique: true }
);


export const ChallengeCodeTemplateModel = model<IChallengeCodeTemplateDoc>(
  "ChallengeCodeTemplate",
  ChallengeCodeTemplateSchema
);
