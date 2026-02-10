import mongoose, { Schema, Document, Types } from "mongoose";


export interface IChallengeDoc extends Document {
    title: string;
    description: string;

    difficulty: "easy" | "medium" | "hard";
    // domain: "javascript" | "python" | "algorithm" | "database" | "network";
    domain:
    | "arrays"
    | "strings"
    | "linked-list"
    | "stack"
    | "queue"
    | "tree"
    | "graph"
    | "dp"
    | "math"
    | "sql";

    xpReward: number;
    // timeLimitMinutes: number;
    timeLimitMinutes?: number;

    isPremium: boolean;
    isActive: boolean;

    status: "draft" | "active" | "archived";

    availableFrom?: Date | null;
    availableUntil?: Date | null;

    tags: Types.ObjectId[];
    languages: Types.ObjectId[];

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
            // enum: ["javascript", "python", "algorithm", "database", "network"],
            enum: [
                "arrays",
                "strings",
                "linked-list",
                "stack",
                "queue",
                "tree",
                "graph",
                "dp",
                "math",
                "sql",
            ],
            required: true,
        },

        xpReward: { type: Number, required: true },
        // timeLimitMinutes: { type: Number, required: true },
        timeLimitMinutes: { type: Number },

        isPremium: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },

        status: {
            type: String,
            enum: ["draft", "active", "archived"],
            default: "draft",
        },

        availableFrom: { type: Date, default: null, index: true },
        availableUntil: { type: Date, default: null, index: true },

        tags: [{ type: Schema.Types.ObjectId, ref: "ChallengeTag", default: [] }],

        languages: [{ type: Schema.Types.ObjectId, ref: "ProgrammingLanguage", default: [] }],

    },
    { timestamps: true }
);

export const ChallengeModel = mongoose.model<IChallengeDoc>(
    "Challenge",
    ChallengeSchema
);
