// import jwt, { SignOptions } from "jsonwebtoken";
// import { ENV } from "../../config/env";


// export class JwtService {
//   static generateAccessToken(payload: object) {
//     return jwt.sign(
//       payload,
//       ENV.JWT_ACCESS_SECRET as string,
//       { expiresIn: ENV.ACCESS_TOKEN_EXPIRES } as SignOptions
//     );
//   }

//   static generateRefreshToken(payload: object) {
//     return jwt.sign(
//       payload,
//       ENV.JWT_REFRESH_SECRET as string,
//       { expiresIn: ENV.ACCESS_TOKEN_EXPIRES } as SignOptions
//     );
//   }

//   static verifyAccessToken(token: string) {
//     return jwt.verify(token, ENV.JWT_ACCESS_SECRET as string);
//   }

//   static verifyRefreshToken(token: string) {
//     return jwt.verify(token, ENV.JWT_REFRESH_SECRET as string);
//   }
// }



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






// import jwt, { SignOptions } from "jsonwebtoken";
// import { ENV } from "../../config/env";
// import { IJwtService } from "../../domain/services/IJwtService";

// export class JwtService implements IJwtService {
//   generateAccessToken(payload: object): string {
//     return jwt.sign(
//       payload,
//       ENV.JWT_ACCESS_SECRET,
//       { expiresIn: ENV.ACCESS_TOKEN_EXPIRES } as SignOptions
//     );
//   }

//   generateRefreshToken(payload: object): string {
//     return jwt.sign(
//       payload,
//       ENV.JWT_REFRESH_SECRET,
//       { expiresIn: ENV.REFRESH_TOKEN_EXPIRES } as SignOptions
//     );
//   }

//   verifyAccessToken(token: string): object {
//     return jwt.verify(token, ENV.JWT_ACCESS_SECRET);
//   }

//   verifyRefreshToken(token: string): object {
//     return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
//   }
// }
