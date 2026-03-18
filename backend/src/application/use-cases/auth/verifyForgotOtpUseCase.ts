import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";


export class VerifyForgotOtpUseCase {
  constructor(
    private readonly _userRepo: IUserRepository
  ) { }


  async execute(userId: string, otp: string) {

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.isOtpValid(otp)) {
      throw new Error("INVALID_OR_EXPIRED_OTP");
    }

    user.clearOtp();

    // clear OTP so it cannot be reused
    await this._userRepo.saveOtp(userId, null, null);

    return { success: true };
  }
}
