// import { Request, Response, NextFunction } from "express";



// export const requireRole = (role: "user" | "admin") => {
//   return (req: any, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     if (req.user.role !== role) {
//       return res.status(403).json({ message: "Forbidden: Access denied" });
//     }

//     next();
//   };
// };



import { Request, Response, NextFunction } from "express";

interface AuthUserContext {
  userId: string;
  role: "user" | "admin";
}

export const requireRole = (role: "user" | "admin") => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as AuthUserContext | undefined;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};
