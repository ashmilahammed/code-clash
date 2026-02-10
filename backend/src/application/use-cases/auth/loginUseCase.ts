import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IEmailService } from "../../../domain/services/IEmailService";
import { IPasswordService } from "../../../domain/services/IPasswordService";
import { IJwtService } from "../../../domain/services/IJwtService";
import { generateOtp } from "../../../utils/generateOtp";

import { UpdateLoginStreakUseCase } from "../user/user/updateLoginStreakUseCase";



export class LoginUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _emailService: IEmailService,
    private readonly _passwordService: IPasswordService,
    private readonly _jwtService: IJwtService,
    private readonly _updateLoginStreakUseCase: UpdateLoginStreakUseCase
  ) { }


  async execute(email: string, password: string) {

    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new Error("USER_NOT_FOUND");

    // user not verified ,resend OTP
    if (!user.isVerified) {
      const { otp, expires } = generateOtp();
      await this._userRepository.saveOtp(user.id!, otp, expires, true);
      await this._emailService.sendOtpEmail(email, otp);
      throw new Error("ACCOUNT_NOT_VERIFIED");
    }

    if (user.status === "blocked") {
      throw new Error("ACCOUNT_BLOCKED");
    }

    // Google-only user
    // if (!user.password) {
    //   throw new Error("GOOGLE_ONLY_ACCOUNT");
    // }
    if (!user.hasPassword()) {
      throw new Error("GOOGLE_ONLY_ACCOUNT");
    }

    // const isMatch = await this._passwordService.compare(password, user.password);
    const isMatch = await user.verifyPassword(password, this._passwordService);

    if (!isMatch) throw new Error("INVALID_CREDENTIALS");

    //login streak
    await this._updateLoginStreakUseCase.execute(user.id!);

    //jwt payload
    const payload = {
      userId: user.id!,
      email: user.email,
      role: user.role,
    };

    const accessToken = this._jwtService.generateAccessToken(payload);
    const refreshToken = this._jwtService.generateRefreshToken(payload);

    // store token in db
    await this._userRepository.updateRefreshToken(user.id!, refreshToken);

    return { user, accessToken, refreshToken };
  }
}





