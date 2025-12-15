import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { PasswordService } from "../../../infrastructure/security/passwordService";
import { generateOtp } from "../../../utils/generateOtp";
import { EmailService } from "../../../infrastructure/services/emailService";

const userRepo = new UserRepository();
const emailService = new EmailService();

export const registerUseCase = async (
  username: string,
  email: string,
  password: string
) => {

  // 
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("Email already registered");

  //
  const hashed = await PasswordService.hashPassword(password);

  //Create user without otp 
  const newUser = await userRepo.createUser({
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

    //
    isVerified: false,
  });

  // Generate OTP
  const { otp, expires } = generateOtp();

  // 
  await userRepo.saveOtp(newUser.id!, otp, expires, true);

  // 
  await emailService.sendOtpEmail(email, otp);

  console.log(`REGISTER OTP for ${email}: ${otp}`);

  return {
    message: "OTP sent to email",
    userId: newUser.id, // required for /verify-otp
  };
};
