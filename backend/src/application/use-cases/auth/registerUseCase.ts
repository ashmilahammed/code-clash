import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IEmailService } from "../../../domain/services/IEmailService";
import { IPasswordService } from "../../../domain/services/IPasswordService";
import { generateOtp } from "../../../utils/generateOtp";

import { UserFactory } from "../../../domain/entities/user/userFactory";
import { RegisterDTO } from "../../dto/auth/RegisterDTO";



export class RegisterUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _emailService: IEmailService,
    private readonly _passwordService: IPasswordService
  ) { }


  async execute(dto: RegisterDTO) {

    const { username, email, password } = dto;

    const existing = await this._userRepo.findByEmail(email);

    // Email already verified 
    if (existing && existing.isVerified) {
      throw new Error("EMAIL_ALREADY_REGISTERED");
    }

    const hashedPassword = await this._passwordService.hash(password);
    const { otp, expires } = generateOtp();

    // Email exists but not verified 
    if (existing && !existing.isVerified) {

      await this._userRepo.updatePassword(existing.id!, hashedPassword);

      await this._userRepo.saveOtp(
        existing.id!,
        otp,
        expires,
        true // reset isVerified
      );

      await this._emailService.sendOtpEmail(email, otp);

      return { userId: existing.id };
    }

    // new user
    const newUser = UserFactory.createEmailUser({
      username,
      email,
      hashedPassword,
      otp,
      otpExpires: expires,
    });

    const createdUser = await this._userRepo.createUser(newUser);

    await this._emailService.sendOtpEmail(email, otp);

    return { userId: createdUser.id };

  }

}
