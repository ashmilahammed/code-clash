import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IEmailService } from "../../../domain/services/IEmailService";
import { generateOtp } from "../../../utils/generateOtp";



export class ResendOtpUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _emailService: IEmailService
  ) { }

  async execute(
    userId: string,
    options?: { ignoreVerified?: boolean }
  ) {

    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    // Only block verified users when NOT in forgot-password flow
    if (user.isVerified && !options?.ignoreVerified) {
      throw new Error("User is already verified");
    }

    const { otp, expires } = generateOtp();

    await this._userRepo.saveOtp(userId, otp, expires);

    await this._emailService.sendOtpEmail(user.email, otp);

    //
    console.log(`Resent OTP to ${user.email}: ${otp}`);

    return { message: "New OTP sent to email" };
  }
}
