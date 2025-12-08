import { JwtService } from "../../../infrastructure/security/jwtService";
import { IUserRepository } from "../../interfaces/IUserRepository";
import bcrypt from "bcrypt";




export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwt: JwtService
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const payload = { id: user._id, email: user.email };

    const accessToken = this.jwt.generateAccessToken(payload);
    const refreshToken = this.jwt.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
