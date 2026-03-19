import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IEmailService } from "../../../domain/services/IEmailService";
import { generateOtp } from "../../../utils/generateOtp";
import { ForgotPasswordDTO } from "../../dto/auth/ForgotPasswordDTO";


export class ForgotPasswordUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _emailService: IEmailService
  ) { }

  async execute(dto : ForgotPasswordDTO) {

    const user = await this._userRepo.findByEmail(dto.email);

    if (!user) throw new Error("No account found with this email");

    const { otp, expires } = generateOtp();

    await this._userRepo.saveOtp(user.id!, otp, expires, false);
    await this._emailService.sendOtpEmail(dto.email, otp);

    // console.log(`Forgot Password OTP for ${email}: ${otp}`);

    return { userId: user.id };
  }
}
