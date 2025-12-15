import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { PasswordService } from "../../../infrastructure/security/passwordService";


const userRepo = new UserRepository();

export const resetPasswordUseCase = async (
  userId: string,
  newPassword: string
) => {
  const hashed = await PasswordService.hashPassword(newPassword);

  await userRepo.updatePassword(userId, hashed);

  //  logout from all devices
  await userRepo.updateRefreshToken(userId, null);

  return { message: "Password reset successfully" };
};
