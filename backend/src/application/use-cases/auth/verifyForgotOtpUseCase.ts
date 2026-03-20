import { IUserCoreRepository } from "../../../domain/repositories/user/IUserCoreRepository";
import { IUserAuthRepository } from "../../../domain/repositories/user/IUserAuthRepository";


export class VerifyForgotOtpUseCase {
  constructor(
    private readonly _userRepo: IUserCoreRepository & IUserAuthRepository
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
