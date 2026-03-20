import { User } from "../../entities/user/User";

export interface IUserGamificationRepository {
  updateLoginStreak(
    userId: string, 
    currentStreak: number, 
    longestStreak: number, 
    lastLoginDate: Date
  ): Promise<void>;

  addXp(userId: string, xp: number): Promise<void>;

  updateLevel(userId: string, levelId: string): Promise<void>;

  updateBadge(userId: string, badgeId: string): Promise<void>;
  
  getLeaderboard(
    page?: number, 
    limit?: number, 
    search?: string
  ): Promise<{ data: User[]; total: number }>;
}
