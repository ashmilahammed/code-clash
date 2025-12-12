import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "../../config/env";




export class JwtService {
  static generateAccessToken(payload: object) {
    return jwt.sign(
      payload,
      ENV.JWT_ACCESS_SECRET as string,
      { expiresIn: ENV.ACCESS_TOKEN_EXPIRES } as SignOptions
    );
  }

  static generateRefreshToken(payload: object) {
    return jwt.sign(
      payload,
      ENV.JWT_REFRESH_SECRET as string,
      { expiresIn: ENV.ACCESS_TOKEN_EXPIRES } as SignOptions
    );
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET as string);
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET as string);
  }
}
