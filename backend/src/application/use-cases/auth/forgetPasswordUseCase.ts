import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IEmailService } from "../../../domain/services/IEmailService";
import { generateOtp } from "../../../utils/generateOtp";



export class ForgotPasswordUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _emailService: IEmailService
  ) {}

  async execute(email: string) {
    const user = await this._userRepo.findByEmail(email);
    if (!user) throw new Error("No account found with this email");

    const { otp, expires } = generateOtp();

    await this._userRepo.saveOtp(user.id!, otp, expires, false);
    await this._emailService.sendOtpEmail(email, otp);

    console.log(`Forgot Password OTP for ${email}: ${otp}`);

    return { userId: user.id };
  }
}
