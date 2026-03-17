import { IChallengeCodeTemplateRepository } from "../../../../domain/repositories/challenge/IChallengeCodeTemplateRepository";
import { ISubmissionRepository } from "../../../../domain/repositories/submission/ISubmissionRepository";


export class GetChallengeCodeTemplatesUseCase {
  constructor(
    private readonly repo: IChallengeCodeTemplateRepository,
    private readonly submissionRepo: ISubmissionRepository,
  ) {}

  async execute(challengeId: string, userId: string) {
    const [templates, isSolved] = await Promise.all([
      this.repo.findByChallenge(challengeId),
      this.submissionRepo.hasUserSolvedChallenge(userId, challengeId),
    ]);

    return templates.map(t => ({
      language: t.language,
      starterCode: t.starterCode,
      solutionCode: isSolved ? t.solutionCode : null,
    }));
  }
}
