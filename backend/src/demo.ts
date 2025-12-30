// import { Request, Response, NextFunction } from "express";

// export const loginValidator = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({
//       message: "Email and password are required",
//     });
//   }

//   if (typeof email !== "string" || typeof password !== "string") {
//     return res.status(400).json({
//       message: "Invalid input type",
//     });
//   }

//   const emailRegex = /^\S+@\S+\.\S+$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).json({
//       message: "Invalid email format",
//     });
//   }

//   if (password.length < 6) {
//     return res.status(400).json({
//       message: "Password must be at least 6 characters",
//     });
//   }

//   next();
// };
