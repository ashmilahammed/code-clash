
import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { Challenge } from "../../../../domain/entities/challenge/Challenge";

export class UpdateChallengeUseCase {
    constructor(private readonly _challengeRepo: IChallengeRepository) { }

    async execute(id: string, data: Partial<Challenge>): Promise<Challenge> {
        return this._challengeRepo.update(id, data);
    }
}
