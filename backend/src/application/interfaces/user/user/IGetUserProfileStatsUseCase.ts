import { UserResponseDTO } from "../../../dto/user/UserResponseDTO";

export interface IGetUserProfileStatsUseCase {
  execute(userId: string): Promise<{
    user: UserResponseDTO;
    level: {
      level: number;
      currentXp: number;
      minXp: number;
      maxXp: number;
      nextLevelXp: number;
    };
    streak: {
      current: number;
      longest: number;
    };
    stats: any;
    recentActivity: any[];
  }>;
}
