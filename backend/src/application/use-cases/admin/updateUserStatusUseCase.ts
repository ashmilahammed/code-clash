import { IUserRepository } from "../../../domain/repositories/IUserRepository";


export class UpdateUserStatusUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(
    adminRole: "admin" | "user",
    userId: string,
    status: "active" | "blocked"
  ): Promise<void> {
    if (adminRole !== "admin") {
      throw new Error("FORBIDDEN");
    }

    await this.userRepo.updateStatus(userId, status);
  }
}

