import mongoose, { Schema, Document } from "mongoose";


export interface IUserDoc extends Document {
  username: string;
  email: string;
  password?: string | null;

  avatar?: string | null;
  avatarPublicId?: string | null;

  about?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;

  badge_id?: string | null;
  level_id?: string | null;

  xp: number;

  current_streak: number;
  longest_streak: number;
  last_login_date?: Date | null;


  is_premium: boolean;

  date_joined: Date;

  role: "user" | "admin";
  status: "active" | "blocked";

  refreshToken?: string | null;

  isVerified: boolean;
  otp?: string | null;
  otpExpires?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}




const UserSchema = new Schema<IUserDoc>(
  {
    username: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: false, default: null },

    avatar: { type: String, default: null },
    avatarPublicId: { type: String, default: null },

    about: { type: String, default: null },
    github_url: { type: String, default: null },
    linkedin_url: { type: String, default: null },

    badge_id: { type: Schema.Types.ObjectId, ref: "Badge", default: null },
    level_id: { type: Schema.Types.ObjectId, ref: "Level", default: null },

    xp: { type: Number, default: 0 },

    current_streak: { type: Number, default: 0 },
    longest_streak: { type: Number, default: 0 },
    last_login_date: { type: Date, default: null },

    is_premium: { type: Boolean, default: false },

    date_joined: { type: Date, default: Date.now },

    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "blocked"], default: "active" },

    refreshToken: { type: String, default: null },

    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);


export const UserModel = mongoose.model<IUserDoc>("User", UserSchema);
