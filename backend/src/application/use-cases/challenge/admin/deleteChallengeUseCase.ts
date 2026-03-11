import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";

export class DeleteChallengeUseCase {
  constructor(private readonly _repo: IChallengeRepository) {}

  async execute(id: string): Promise<void> {
    const challenge = await this._repo.findById(id);
    if (!challenge) {
      throw new Error("CHALLENGE_NOT_FOUND");
    }

    // You might want to add logic here to delete associated data 
    // if your database setup doesn't handle cascades, but since 
    // it's MongoDB with separate collections, we might need to 
    // manually delete tags relationships if they are stored elsewhere.
    // In this case, tags and languages are just arrays in the Challenge document.
    // However, hints, test cases, and templates are separate collections.

    await this._repo.delete(id);
  }
}
