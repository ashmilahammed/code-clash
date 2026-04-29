export interface IResendOtpUseCase {
  execute(userId: string, options?: { ignoreVerified?: boolean }): Promise<void>;
}
