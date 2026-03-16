import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { Challenge } from "../../../../domain/entities/challenge/Challenge";
import { UpdateChallengeDTO } from "../../../dto/challenge/UpdateChallengeDTO";


export class UpdateChallengeUseCase {

    constructor(
        private readonly _challengeRepo: IChallengeRepository
    ) {}

    async execute(dto: UpdateChallengeDTO): Promise<Challenge> {

        const { challengeId, ...updateData } = dto;

        return this._challengeRepo.update(
            challengeId,
            updateData   // still Partial<Challenge>
        );
    }
}