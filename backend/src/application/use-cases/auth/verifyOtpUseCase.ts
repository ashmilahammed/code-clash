import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";



export class VerifyOtpUseCase {
  constructor(private userRepo: IUserRepository) { }

  async execute(userId: string, otp: string) {

    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.isVerified) {
      throw new Error("User is already verified");
    }

    // if (user.otp !== otp) {
    //   throw new Error("INVALID_OTP");
    // }
    //     if (!user.otpExpires || user.otpExpires < new Date()) {
    //   throw new Error("OTP_EXPIRED");
    // }
    
    if (!user.isOtpValid(otp)) {
      throw new Error("INVALID_OR_EXPIRED_OTP");
    }

    user.verifyAccount(); // sets isVerified = true + clears OTP internally

    await this.userRepo.verifyUser(userId);

    return {
      message: "OTP verified successfully",
    };
  }
}
