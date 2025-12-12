import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { PasswordService } from "../../../infrastructure/security/passwordService";
import { JwtService } from "../../../infrastructure/security/jwtService";



const userRepo = new UserRepository();

export const registerUseCase = async (
  username: string,
  email: string,
  password: string
) => {
  // Check if user exists
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("Email already registered");

  // Hash password
  const hashed = await PasswordService.hashPassword(password);

  // Create user (domain entity shape)
  const newUser = await userRepo.createUser({
    username,
    email,
    password: hashed,

    avatar_id: null,
    badge_id: null,
    level_id: null,

    xp: 0,

    current_streak: 0,
    longest_streak: 0,

    is_premium: false,

    date_joined: new Date(),

    role: "user",
    status: "active",

    refreshToken: null,
  });

  // JWT payload
  const payload = {
    userId: newUser.id!,
    email: newUser.email,
    role: newUser.role,
  };

  // Generate tokens
  const accessToken = JwtService.generateAccessToken(payload);
  const refreshToken = JwtService.generateRefreshToken(payload);

  return {
    user: newUser,
    accessToken,
    refreshToken,
  };
};
