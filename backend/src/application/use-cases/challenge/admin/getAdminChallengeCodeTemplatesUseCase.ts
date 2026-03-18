import { IChallengeCodeTemplateRepository } from "../../../../domain/repositories/challenge/IChallengeCodeTemplateRepository";


export class GetAdminChallengeCodeTemplatesUseCase {
    constructor(
        private readonly _repo: IChallengeCodeTemplateRepository
    ) { }

    async execute(challengeId: string) {
        const templates = await this._repo.findByChallenge(challengeId);

        return templates.map(t => ({
            language: t.language,
            starterCode: t.starterCode,
            solutionCode: t.solutionCode,
        }));
    }
}
