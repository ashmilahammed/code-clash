import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AuthUserDTO } from "../../dto/AuthUserDTO";




export class GetCurrentUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<AuthUserDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return {
      id: user.id!,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }
}
