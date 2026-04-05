import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ISubmissionRepository } from "../../../../domain/repositories/submission/ISubmissionRepository";

export class GetUserSolvedCountUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _submissionRepository: ISubmissionRepository
  ) {}

  async execute(userId: string): Promise<{ username: string; solvedCount: number }> {

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const solvedCount = await this._submissionRepository.countSolved(userId);

    return {
      username: user.username,
      solvedCount,
    };
  }

}
