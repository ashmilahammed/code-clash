import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { generateOtp } from "../../../utils/generateOtp";
import { EmailService } from "../../../infrastructure/services/emailService";


const userRepo = new UserRepository();
const emailService = new EmailService();

export const resendOtpUseCase = async (userId: string) => {
    const user = await userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.isVerified) {
        throw new Error("User is already verified");
    }

    const { otp, expires } = generateOtp();

    await userRepo.saveOtp(userId, otp, expires);

    await emailService.sendOtpEmail(user.email, otp);

    console.log(`Resent OTP to ${user.email}: ${otp}`);

    return { message: "New OTP sent to email" };
};
