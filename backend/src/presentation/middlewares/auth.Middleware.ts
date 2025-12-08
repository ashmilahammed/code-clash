import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../infrastructure/security/jwtService";


const jwt = new JwtService();

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
