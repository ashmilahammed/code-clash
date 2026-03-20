import { IUserAdminRepository } from "../../../../domain/repositories/user/IUserAdminRepository";
import { Logger } from "../../../../infrastructure/services/logger";


export class UpdateUserStatusUseCase {
  constructor(
    private readonly _userRepo: IUserAdminRepository,
    private readonly _logger: Logger
  ) { }

  async execute(
    adminRole: "admin" | "user",
    userId: string,
    status: "active" | "blocked"
  ): Promise<void> {

    if (adminRole !== "admin") {
      this._logger.warn("Unauthorized status update attempt", {
        targetUserId: userId,
        attemptedStatus: status,
      });
      throw new Error("FORBIDDEN");
    }

    await this._userRepo.updateStatus(userId, status);


    //Audit log
    this._logger.warn("User status updated by admin", {
      targetUserId: userId,
      newStatus: status,
    });
  }
}

