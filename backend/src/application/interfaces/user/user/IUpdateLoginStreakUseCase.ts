export interface IUpdateLoginStreakUseCase {
  execute(userId: string): Promise<void>;
}
