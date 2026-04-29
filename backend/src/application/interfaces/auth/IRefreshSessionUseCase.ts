export interface IRefreshSessionUseCase {
  execute(refreshToken: string): Promise<{ accessToken: string }>;
}
