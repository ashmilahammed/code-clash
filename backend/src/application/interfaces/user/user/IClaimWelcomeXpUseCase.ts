export interface IClaimWelcomeXpUseCase {
  execute(userId: string): Promise<{ success: boolean; xp: number }>;
}
