import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IEmailService } from "../../../domain/services/IEmailService";
import { IPasswordService } from "../../../domain/services/IPasswordService";
import { generateOtp } from "../../../utils/generateOtp";



export class RegisterUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _emailService: IEmailService,
    private readonly _passwordService: IPasswordService
  ) { }


  async execute(username: string, email: string, password: string) {

    const existing = await this._userRepo.findByEmail(email);

    // Email already verified 
    if (existing && existing.isVerified) {
      throw new Error("EMAIL_ALREADY_REGISTERED");
    }

    const hashed = await this._passwordService.hash(password);
    const { otp, expires } = generateOtp();

    // Email exists but not verified 
    if (existing && !existing.isVerified) {
      await this._userRepo.updatePassword(existing.id!, hashed);

      await this._userRepo.saveOtp(
        existing.id!,
        otp,
        expires,
        true // reset isVerified
      );

      await this._emailService.sendOtpEmail(email, otp);

      return { userId: existing.id };
    }

    // New user
    const newUser = await this._userRepo.createUser({
      username,
      email,
      password: hashed,

      avatar_id: null,
      badge_id: null,
      level_id: null,

      xp: 0,
      current_streak: 0,
      longest_streak: 0,

      is_premium: false,
      date_joined: new Date(),

      role: "user",
      status: "active",
      refreshToken: null,
      isVerified: false,

      otp,
      otpExpires: expires,
    });

    await this._emailService.sendOtpEmail(email, otp);

    return { userId: newUser.id };
  }

}




