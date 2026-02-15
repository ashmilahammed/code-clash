import { IChallengeHintRepository } from "../../../../domain/repositories/challenge/IChallengeHintRepository";
import { ChallengeHint } from "../../../../domain/entities/challenge/ChallengeHint";

export class GetChallengeHintsUseCase {
    constructor(
        private readonly hintRepo: IChallengeHintRepository
    ) { }

    async execute(challengeId: string): Promise<ChallengeHint[]> {
        if (!challengeId) {
            throw new Error("CHALLENGE_ID_REQUIRED");
        }

        return this.hintRepo.findByChallenge(challengeId);
    }
}
