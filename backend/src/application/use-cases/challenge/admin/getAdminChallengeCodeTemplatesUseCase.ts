import { IChallengeCodeTemplateRepository } from "../../../../domain/repositories/challenge/IChallengeCodeTemplateRepository";

export class GetAdminChallengeCodeTemplatesUseCase {
    constructor(
        private readonly repo: IChallengeCodeTemplateRepository
    ) { }

    async execute(challengeId: string) {
        const templates = await this.repo.findByChallenge(challengeId);

        // Admin needs full details including solutionCode
        return templates.map(t => ({
            language: t.language,
            starterCode: t.starterCode,
            solutionCode: t.solutionCode,
        }));
    }
}
