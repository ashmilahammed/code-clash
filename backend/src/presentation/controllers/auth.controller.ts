import { Request, Response } from "express";
import { registerUseCase } from "../../application/use-cases/auth/registerUseCase";
import { LoginUseCase } from "../../application/use-cases/auth/loginUseCase";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";


// Create repository + use-case instance
const userRepo = new UserRepository();
const loginUseCase = new LoginUseCase(userRepo);

export const registerController = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const result = await registerUseCase(username, email, password);

    // result.user is already a DTO
    const userDTO = result.user;

    return res.json({
      message: "User registered successfully",
      user: userDTO,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });

  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};



export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUseCase.execute(email, password);

    // result.user is already a DTO
    const userDTO = result.user;

    return res.json({
      message: "Login successful",
      user: userDTO,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });

  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
