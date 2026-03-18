import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";

export class DeleteChallengeUseCase {
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
