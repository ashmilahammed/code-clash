import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IJwtService } from "../../../domain/services/IJwtService";
import { JwtPayload } from "../../../domain/types/JwtPayload";


export class RefreshSessionUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _jwtService: IJwtService
  ) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("NO_REFRESH_TOKEN");
    }

    const payload: JwtPayload =
      this._jwtService.verifyRefreshToken(refreshToken);

    const user = await this._userRepo.findById(payload.userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (user.refreshToken !== refreshToken) {
      throw new Error("INVALID_SESSION");
    }

    if (user.status === "blocked") {
      throw new Error("ACCOUNT_BLOCKED");
    }

    const newAccessToken = this._jwtService.generateAccessToken({
      userId: user.id!,
      role: user.role,
    });

    return { accessToken: newAccessToken };
  }
}




// import { IUserRepository } from "../../../domain/repositories/IUserRepository";
// import { JwtService } from "../../../infrastructure/security/jwtService";


// export class RefreshSessionUseCase {
//   constructor(private userRepo: IUserRepository) {}

//   async execute(refreshToken: string) {
//     if (!refreshToken) {
//       throw new Error("No refresh token provided");
//     }

//     // verify refresh token
//     const payload = JwtService.verifyRefreshToken(refreshToken) as {
//       userId: string;
//       email: string;
//       role: string;
//     };

//     const user = await this.userRepo.findById(payload.userId);
//     if (!user) throw new Error("User not found");


//     //compare stored refresh token (extra security)
//     if (user.refreshToken !== refreshToken) {
//       throw new Error("Invalid session");
//     };

//     //
//     if(user.status === "blocked"){
//       throw new Error("ACCOUNT_BLOCKED")
//     }

    
//     const newAccessToken = JwtService.generateAccessToken({
//       userId: user.id!,
//       email: user.email,
//       role: user.role,
//     });

//     return { accessToken: newAccessToken };
//   }
// }
