import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { PasswordService } from "../../../infrastructure/security/passwordService";
import { JwtService } from "../../../infrastructure/security/jwtService";
import { generateOtp } from "../../../utils/generateOtp";


interface IEmailService {
  sendOtpEmail(email: string, otp: string): Promise<void>;
}

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) { }

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    // user not verified ,resend OTP
    if (!user.isVerified) {
      const { otp, expires } = generateOtp();

      await this.userRepository.saveOtp(user.id!, otp, expires, true);
      await this.emailService.sendOtpEmail(email, otp);

      throw new Error("ACCOUNT_NOT_VERIFIED");
    }

    if (user.status === 'blocked') {
      throw new Error("ACCOUNT_BLOCKED")
    }

    // Google-only user
    if (!user.password) {
      throw new Error("Use Google login for this account");
    }

    const isMatch = await PasswordService.comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    //jwt payload
    const payload = {
      userId: user.id!,
      email: user.email,
      role: user.role,
    };

    //
    const accessToken = JwtService.generateAccessToken(payload);
    const refreshToken = JwtService.generateRefreshToken(payload);

    // store token in db
    await this.userRepository.updateRefreshToken(user.id!, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}


