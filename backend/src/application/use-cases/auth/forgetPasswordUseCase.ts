import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { generateOtp } from "../../../utils/generateOtp";


interface IEmailService {
  sendOtpEmail(email: string, otp: string): Promise<void>;
}

export class ForgotPasswordUseCase {
  constructor(
    private userRepo: IUserRepository,
    private emailService: IEmailService
  ) {}

  async execute(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("No account found with this email");

    const { otp, expires } = generateOtp();

    await this.userRepo.saveOtp(user.id!, otp, expires, false);

    await this.emailService.sendOtpEmail(email, otp);

    console.log(`Forgot Password OTP for ${email}: ${otp}`);

    return { userId: user.id };
  }
}
