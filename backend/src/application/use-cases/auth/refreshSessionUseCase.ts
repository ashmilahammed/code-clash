import { IUserCoreRepository } from "../../../domain/repositories/user/IUserCoreRepository";
import { IJwtService } from "../../../domain/services/IJwtService";
import { JwtPayload } from "../../../domain/types/JwtPayload";
import { IRefreshSessionUseCase } from "../../interfaces/auth/IRefreshSessionUseCase";
import { AppError } from "../../../presentation/common/AppError";
import { HttpStatus } from "../../../presentation/constants/httpStatus";
import { MESSAGES } from "../../../presentation/constants/messages";

export class RefreshSessionUseCase implements IRefreshSessionUseCase {
  constructor(
    private readonly _userRepo: IUserCoreRepository,
    private readonly _jwtService: IJwtService
  ) { }


  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new AppError(MESSAGES.AUTH.SESSION_EXPIRED, HttpStatus.UNAUTHORIZED);
    }

    // Verify refresh token
    const payload: JwtPayload =
      this._jwtService.verifyRefreshToken(refreshToken);

    const user = await this._userRepo.findById(payload.userId);
    if (!user) {
      throw new AppError(MESSAGES.COMMON.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    // Validate refresh token via domain
    if (!user.isRefreshTokenValid(refreshToken)) {
      throw new AppError(MESSAGES.AUTH.SESSION_EXPIRED, HttpStatus.UNAUTHORIZED);
    }

    if (user.status === "blocked") {
      throw new AppError(MESSAGES.AUTH.ACCOUNT_BLOCKED, HttpStatus.FORBIDDEN);
    }

    const newAccessToken = this._jwtService.generateAccessToken({
      userId: user.id!,
      role: user.role,
    });

    return { accessToken: newAccessToken };
  }
}