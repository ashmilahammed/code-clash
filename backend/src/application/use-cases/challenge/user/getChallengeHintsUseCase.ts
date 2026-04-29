import { IChallengeHintRepository } from "../../../../domain/repositories/challenge/IChallengeHintRepository";
import { ChallengeHint } from "../../../../domain/entities/challenge/ChallengeHint";
import { IGetChallengeHintsUseCase } from "../../../interfaces/challenge/user/IGetChallengeHintsUseCase";

export class GetChallengeHintsUseCase implements IGetChallengeHintsUseCase {
    constructor(
        private readonly _hintRepo: IChallengeHintRepository
    ) { }

    async execute(challengeId: string): Promise<ChallengeHint[]> {
        if (!challengeId) {
            throw new Error("CHALLENGE_ID_REQUIRED");
        }

        return this._hintRepo.findByChallenge(challengeId);
    }
}
