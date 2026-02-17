export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;

  xp: number;
  level_id: string | null;
  avatar: string | null;
  about: string | null;

  github_url: string | null;
  linkedin_url: string | null;

  badge_id: string | null;

  current_streak: number;
  longest_streak: number;

  is_premium: boolean;

  role: "user" | "admin";
  status: "active" | "blocked";

  // isVerified: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
