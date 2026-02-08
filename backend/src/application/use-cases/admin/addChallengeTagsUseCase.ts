import { IChallengeRepository } from "../../../domain/repositories/IChallengeRepository";
import { IChallengeTagRepository } from "../../../domain/repositories/IChallengeTagRepository";



export class AddChallengeTagsUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository,
    private readonly _tagRepo: IChallengeTagRepository
  ) {}

  async execute(challengeId: string, tags: string[]) {
    const tagIds = [];

    for (const tag of tags) {
      const id = await this._tagRepo.findOrCreate(tag.toLowerCase());
      tagIds.push(id);
    }

    await this._challengeRepo.addTags(challengeId, tagIds);
  }
}
