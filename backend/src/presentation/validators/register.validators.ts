import { Request, Response, NextFunction } from "express";


export const registerValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (typeof username !== "string" || username.trim().length < 3) {
    return res.status(400).json({
      message: "Username must be at least 3 characters",
    });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  next();
};
