import { ChallengeDifficulty, ChallengeDomain, ChallengeStatus } from "../../../domain/entities/Challenge";

export interface ChallengeResponseDTO {
    id: string;
    title: string;
    description: string;
    difficulty: ChallengeDifficulty;
    domain: ChallengeDomain;
    xpReward: number;
    timeLimitMinutes?: number;
    isPremium: boolean;
    isActive: boolean;
    status: ChallengeStatus;
}
