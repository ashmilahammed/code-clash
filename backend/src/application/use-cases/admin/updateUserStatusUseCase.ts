import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Logger } from "../../../infrastructure/services/logger";

export class UpdateUserStatusUseCase {
  constructor(
    private userRepo: IUserRepository,
    private logger: Logger
  ) { }

  async execute(
    adminRole: "admin" | "user",
    userId: string,
    status: "active" | "blocked"
  ): Promise<void> {

    if (adminRole !== "admin") {
      this.logger.warn("Unauthorized status update attempt", {
        targetUserId: userId,
        attemptedStatus: status,
      });
      throw new Error("FORBIDDEN");
    }

    await this.userRepo.updateStatus(userId, status);


    //AUDIT LOG 
    this.logger.warn("User status updated by admin", {
      targetUserId: userId,
      newStatus: status,
    });
  }
}

