import { IUserCoreRepository } from "../../../domain/repositories/user/IUserCoreRepository";
import { IUserAuthRepository } from "../../../domain/repositories/user/IUserAuthRepository";
import { VerifyOtpDTO } from "../../dto/auth/VerifyOtpDTO";


export class VerifyOtpUseCase {
  constructor(
    private readonly _userRepo: IUserCoreRepository & IUserAuthRepository
  ) {}

  async execute(dto: VerifyOtpDTO) {
    const { userId, otp } = dto;

    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error("USER_NOT_FOUND");

    if (user.isVerified) {
      throw new Error("USER_ALREADY_VERIFIED");
    }

    if (!user.isOtpValid(otp)) {
      throw new Error("INVALID_OR_EXPIRED_OTP");
    }

    user.verifyAccount();

    await this._userRepo.verifyUser(userId);

    return {
      message: "OTP verified successfully",
    };
  }
}