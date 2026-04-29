export interface IGetUserSolvedCountUseCase {
  execute(userId: string): Promise<{ username: string; solvedCount: number }>;
}
