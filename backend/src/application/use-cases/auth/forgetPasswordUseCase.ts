import { IUserCoreRepository } from "../../../domain/repositories/user/IUserCoreRepository";
import { IUserAuthRepository } from "../../../domain/repositories/user/IUserAuthRepository";
import { IEmailService } from "../../../domain/services/IEmailService";
import { generateOtp } from "../../../utils/generateOtp";
import { ForgotPasswordDTO } from "../../dto/auth/ForgotPasswordDTO";


export class ForgotPasswordUseCase {
  constructor(
    private readonly _userRepo: IUserCoreRepository & IUserAuthRepository,
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
