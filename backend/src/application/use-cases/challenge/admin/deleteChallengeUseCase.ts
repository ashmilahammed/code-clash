import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { IDeleteChallengeUseCase } from "../../../interfaces/challenge/admin/IDeleteChallengeUseCase";


export class DeleteChallengeUseCase implements IDeleteChallengeUseCase {
  constructor(
    private readonly _repo: IChallengeRepository
  ) { }

  async execute(id: string): Promise<void> {
    const challenge = await this._repo.findById(id);
    if (!challenge) {
      throw new Error("CHALLENGE_NOT_FOUND");
    }

    await this._repo.delete(id);
  }
}
