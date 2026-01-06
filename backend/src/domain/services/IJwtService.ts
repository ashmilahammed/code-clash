// export interface IJwtService {
//   generateAccessToken(payload: object): string;
//   generateRefreshToken(payload: object): string;
//   verifyAccessToken(token: string): object;
//   verifyRefreshToken(token: string): object;
// }


import { JwtPayload } from "../types/JwtPayload";

export interface IJwtService {
  generateAccessToken(payload: JwtPayload): string;
  generateRefreshToken(payload: JwtPayload): string;

  verifyAccessToken(token: string): JwtPayload;
  verifyRefreshToken(token: string): JwtPayload;
}
