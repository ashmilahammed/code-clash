export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;

  xp: number;
  level_id: string | null;
  avatar_id: string | null;
  badge_id: string | null;

  current_streak: number;
  longest_streak: number;

  is_premium: boolean;

  role: "user" | "admin";
  status: "active" | "blocked";

  createdAt?: Date;
  updatedAt?: Date;
}
