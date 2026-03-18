import { IChallengeCodeTemplateRepository } from "../../../../domain/repositories/challenge/IChallengeCodeTemplateRepository";
import { ISubmissionRepository } from "../../../../domain/repositories/submission/ISubmissionRepository";


export class GetChallengeCodeTemplatesUseCase {
  constructor(
    private readonly _repo: IChallengeCodeTemplateRepository,
    private readonly _submissionRepo: ISubmissionRepository,
  ) {}

  async execute(challengeId: string, userId: string) {
    const [templates, isSolved] = await Promise.all([
      this._repo.findByChallenge(challengeId),
      this._submissionRepo.hasUserSolvedChallenge(userId, challengeId),
    ]);

    return templates.map(t => ({
      language: t.language,
      starterCode: t.starterCode,
      solutionCode: isSolved ? t.solutionCode : null,
    }));
  }
}
