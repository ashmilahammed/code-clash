import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },

        password: { type: String },

        avatar: { type: String, default: null },

        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        streak: { type: Number, default: 0 },

        role: { type: String, default: "user" },

        refreshToken: { type: String, default: null }
    },
    { timestamps: true }
);


export default mongoose.model("User", UserSchema);
