import { IChallengeCodeTemplateRepository } from "../../../../domain/repositories/challenge/IChallengeCodeTemplateRepository";
import { IGetAdminChallengeCodeTemplatesUseCase } from "../../../interfaces/challenge/admin/IGetAdminChallengeCodeTemplatesUseCase";


export class GetAdminChallengeCodeTemplatesUseCase implements IGetAdminChallengeCodeTemplatesUseCase {
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
