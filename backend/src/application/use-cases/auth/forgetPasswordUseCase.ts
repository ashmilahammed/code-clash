import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { generateOtp } from "../../../utils/generateOtp";
import { EmailService } from "../../../infrastructure/services/emailService";



const userRepo = new UserRepository();
const emailService = new EmailService();


export const forgotPasswordUseCase = async (email: string) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("No account found with this email");

  const { otp, expires } = generateOtp();

  // Forgot-password OTP 
  await userRepo.saveOtp(user.id!, otp, expires, false);

  await emailService.sendOtpEmail(email, otp);

  console.log(`Forgot Password OTP for ${email}: ${otp}`);

  return { userId: user.id };
};
