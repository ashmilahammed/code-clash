import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "../../config/env";
import { IJwtService } from "../../domain/services/IJwtService";
import { JwtPayload } from "../../domain/types/JwtPayload";


export class JwtService implements IJwtService {
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: ENV.ACCESS_TOKEN_EXPIRES } as SignOptions
    );
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      ENV.JWT_REFRESH_SECRET,
      { expiresIn: ENV.REFRESH_TOKEN_EXPIRES } as SignOptions
    );
  }

  verifyAccessToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET);

    if (typeof decoded === "string") {
      throw new Error("INVALID_TOKEN_PAYLOAD");
    }

    return decoded as JwtPayload;
  }

  verifyRefreshToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, ENV.JWT_REFRESH_SECRET);

    if (typeof decoded === "string") {
      throw new Error("INVALID_TOKEN_PAYLOAD");
    }

    return decoded as JwtPayload;
  }
}



