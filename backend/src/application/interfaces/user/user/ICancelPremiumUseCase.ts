export interface ICancelPremiumUseCase {
  execute(userId: string): Promise<void>;
}
