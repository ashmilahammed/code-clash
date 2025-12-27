import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { JwtService } from "../../../infrastructure/security/jwtService";




export class RefreshSessionUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("No refresh token provided");
    }

    // verify refresh token
    const payload = JwtService.verifyRefreshToken(refreshToken) as {
      userId: string;
      email: string;
      role: string;
    };

    const user = await this.userRepo.findById(payload.userId);
    if (!user) throw new Error("User not found");


    //compare stored refresh token (extra security)
    if (user.refreshToken !== refreshToken) {
      throw new Error("Invalid session");
    }

    const newAccessToken = JwtService.generateAccessToken({
      userId: user.id!,
      email: user.email,
      role: user.role,
    });

    return { accessToken: newAccessToken };
  }
}
