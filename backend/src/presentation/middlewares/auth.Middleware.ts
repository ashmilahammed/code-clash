import { Request, Response, NextFunction } from "express";
import { IUserRepository } from "../../domain/repositories/user/IUserRepository";
import { IJwtService } from "../../domain/services/IJwtService";
import { Logger } from "../../infrastructure/services/logger";


interface AuthUserContext {
  userId: string;
  role: "user" | "admin";
}

export const createAuthMiddleware = (
  userRepo: IUserRepository,
  jwtService: IJwtService,
  logger: Logger
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Missing or invalid Authorization header", {
        path: req.path,
        ip: req.ip,
      });
      return res.status(401).json({ message: "No token" });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }


    try {

      const decoded = jwtService.verifyAccessToken(token);

      const user = await userRepo.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.status === "blocked") {
        return res.status(403).json({
          message: "Your account has been blocked by Admin",
          code: "ACCOUNT_BLOCKED",
        });
      }

      res.locals.user = {
        userId: user.id!,
        role: user.role,
      } satisfies AuthUserContext;

      next();
    } catch (err) {

      logger.error("Invalid or expired token", err);
      
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};








