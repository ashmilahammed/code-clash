export interface IVerifyForgotOtpUseCase {
  execute(userId: string, otp: string): Promise<void>;
}
