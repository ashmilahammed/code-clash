import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";


export class VerifyForgotOtpUseCase {
  constructor(private userRepo: IUserRepository) { }


  async execute(userId: string, otp: string) {

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // if (
    //   user.otp !== otp ||
    //   !user.otpExpires ||
    //   user.otpExpires < new Date()
    // ) {
    //   throw new Error("INVALID_OR_EXPIRED_OTP");
    // }

    // 
    if (!user.isOtpValid(otp)) {
      throw new Error("INVALID_OR_EXPIRED_OTP");
    }

    user.clearOtp();

    // clear OTP so it cannot be reused
    await this.userRepo.saveOtp(userId, null, null);

    return { success: true };
  }
}
