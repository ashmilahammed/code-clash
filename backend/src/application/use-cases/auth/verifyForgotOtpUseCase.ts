import { UserRepository } from "../../../infrastructure/repositories/UserRepository";


const userRepo = new UserRepository();

export const verifyForgotOtpUseCase = async (userId: string, otp: string) => {
    
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    throw new Error("Invalid or expired OTP");
  }

  // clear OTP so it cannot be reused
  await userRepo.saveOtp(userId, null, null);

  return { success: true };
};
