import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "../../config/env";


export class JwtService {
  generateAccessToken(payload: object) {
    return jwt.sign(
      payload,
      ENV.JWT_ACCESS_SECRET as string,
      { expiresIn: ENV.ACCESS_TOKEN_EXPIRES } as SignOptions
    );
  }

  generateRefreshToken(payload: object) {
    return jwt.sign(
      payload,
      ENV.JWT_REFRESH_SECRET as string,
      { expiresIn: ENV.REFRESH_TOKEN_EXPIRES } as SignOptions
    );
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET as string);
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET as string);
  }
}
