import { UserRepository } from "../../../infrastructure/repositories/UserRepository";



const userRepo = new UserRepository();

export const verifyOtpUseCase = async (userId: string, otp: string) => {

    const user = await userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.isVerified) {
        throw new Error("User is already verified");
    }

    if (user.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
        throw new Error("OTP expired");
    }

    ///
    await userRepo.verifyUser(userId);

    return {
        message: "OTP verified successfully",
    };
};
