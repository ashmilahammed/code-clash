// import mongoose from "mongoose";
import dotenv from "dotenv";
import { ProgrammingLanguageModel } from "./models/ProgrammingLanguageModel";
import connectDB from "./mongo";

dotenv.config();

const languages = [
  {
    key: "javascript",
    name: "JavaScript",
    version: "18.x",
    isActive: true,
  },
  {
    key: "python",
    name: "Python",
    version: "3.11",
    isActive: true,
  },
  {
    key: "java",
    name: "Java",
    version: "17",
    isActive: true,
  },
  {
    key: "cpp",
    name: "C++",
    version: "17",
    isActive: true,
  },
];

async function seed() {
  await connectDB();

  for (const lang of languages) {
    await ProgrammingLanguageModel.updateOne(
      { key: lang.key },
      { $set: lang },
      { upsert: true }
    );
  }

  console.log(" Programming languages seeded");
  process.exit(0);
}

seed();
