import { Schema, model, Document } from "mongoose";


export interface IProgrammingLanguageDoc extends Document {
  key: string;
  name: string;
  version: string;
  isActive: boolean;
}

const ProgrammingLanguageSchema = new Schema<IProgrammingLanguageDoc>({
  key: { type: String, unique: true },
  name: String,
  version: String,
  isActive: { type: Boolean, default: true },
});

export const ProgrammingLanguageModel = model<IProgrammingLanguageDoc>(
  "ProgrammingLanguage",
  ProgrammingLanguageSchema
);
