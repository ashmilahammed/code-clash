import { IChallengeRepository } from "../../../../domain/repositories/challenge/IChallengeRepository";
import { Challenge } from "../../../../domain/entities/challenge/Challenge";
import { UpdateChallengeDTO } from "../../../dto/challenge/UpdateChallengeDTO";
import { IUpdateChallengeUseCase } from "../../../interfaces/challenge/admin/IUpdateChallengeUseCase";

export class UpdateChallengeUseCase implements IUpdateChallengeUseCase {

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