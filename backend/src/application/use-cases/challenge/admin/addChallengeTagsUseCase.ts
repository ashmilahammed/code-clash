import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { IChallengeTagRepository } from "../../../../domain/repositories/challenge/IChallengeTagRepository";

export class AddChallengeTagsUseCase {
  constructor(
    private readonly _challengeRepo: IChallengeRepository,
    private readonly _tagRepo: IChallengeTagRepository
  ) {}

  async execute(challengeId: string, tags: string[]) {
    const tagIds: string[] = [];

    for (const tagName of tags) {
      const tag = await this._tagRepo.findOrCreate(tagName);
      tagIds.push(tag.id!);
    }

    await this._challengeRepo.addTags(challengeId, tagIds);
  }
}


