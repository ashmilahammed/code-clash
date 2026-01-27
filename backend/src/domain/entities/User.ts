export interface IUser {
  id?: string;

  username: string;
  email: string;
  password: string | null;

  avatar_id?: string | null;
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

  //
  // createdAt?: Date;
  // updatedAt?: Date;
}
