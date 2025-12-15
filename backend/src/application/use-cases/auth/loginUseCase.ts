import { PasswordService } from "../../../infrastructure/security/passwordService";
import { JwtService } from "../../../infrastructure/security/jwtService";
import { IUserRepository } from "../../interfaces/IUserRepository";



export class LoginUseCase {

  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string) {


    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const isMatch = await PasswordService.comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // jwt payload
    const payload = {
      userId: user.id!,
      email: user.email,
      role: user.role
    };

    // generate token
    const accessToken = JwtService.generateAccessToken(payload);
    const refreshToken = JwtService.generateRefreshToken(payload);

    // store token in db
    await this.userRepository.updateRefreshToken(user.id!, refreshToken);

    return {
      user,
      accessToken,
      refreshToken
    };
  }
}
