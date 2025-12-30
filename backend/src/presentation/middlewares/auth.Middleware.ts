import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../infrastructure/security/jwtService";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";



const userRepo = new UserRepository();

export const authMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = JwtService.verifyAccessToken(token);

    // Always check current user status from DB
    const user = await userRepo.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ 
        message: "Your account has been blocked by Admin",
        code : "ACCOUNT_BLOCKED"
      });
    }

    req.user = {
      userId: user.id,
      role: user.role,
    };

    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};










// import { Request, Response, NextFunction } from "express";
// import { JwtService } from "../../infrastructure/security/jwtService";


// export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: "No token" });

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = JwtService.verifyAccessToken(token);
//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };
