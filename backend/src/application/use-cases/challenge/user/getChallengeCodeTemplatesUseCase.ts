import { IChallengeCodeTemplateRepository } from "../../../../domain/repositories/challenge/IChallengeCodeTemplateRepository";


export class GetChallengeCodeTemplatesUseCase {
  constructor(
    private readonly repo: IChallengeCodeTemplateRepository
  ) {}

  async execute(challengeId: string) {
    const templates = await this.repo.findByChallenge(challengeId);

    // never expose solutionCode
    return templates.map(t => ({
      language: t.language,
      starterCode: t.starterCode,
    }));
  }
}
