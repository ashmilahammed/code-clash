import { Request, Response, NextFunction } from "express";
import { Logger } from "../../infrastructure/services/logger";


interface AuthUserContext {
  userId: string;
  role: "user" | "admin";
}

export const createRequireRole = (
  role: "user" | "admin",
  logger: Logger
) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as AuthUserContext | undefined;

    if (!user) {
      logger.warn("Role check failed: no authenticated user");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== role) {
      logger.warn("Forbidden role access attempt", {
        userId: user.userId,
        requiredRole: role,
        actualRole: user.role,
      });
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};


