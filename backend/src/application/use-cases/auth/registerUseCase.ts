import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { PasswordService } from "../../../infrastructure/security/passwordService";
import { generateOtp } from "../../../utils/generateOtp";



interface IEmailService {
  sendOtpEmail(email: string, otp: string): Promise<void>;
}

export class RegisterUseCase {
  constructor(
    private userRepo: IUserRepository,
    private emailService: IEmailService
  ) {}

  async execute(username: string, email: string, password: string) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("Email already registered");

    const hashed = await PasswordService.hashPassword(password);

    //Create user without otp 
    const newUser = await this.userRepo.createUser({
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
    });

    // generate OTP
    const { otp, expires } = generateOtp();

    //
    await this.userRepo.saveOtp(newUser.id!, otp, expires, true);
    //
    await this.emailService.sendOtpEmail(email, otp);

    console.log(`REGISTER OTP for ${email}: ${otp}`);

    return {
      message: "OTP sent to email",
      userId: newUser.id, // required for /verify-otp
    };
  }
}
