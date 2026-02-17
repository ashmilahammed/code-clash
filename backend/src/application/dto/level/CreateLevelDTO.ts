export interface CreateLevelDTO {
  levelNumber: number;
  minXp: number;
  maxXp: number;
  title?: string;
  badgeId?: string;
}
