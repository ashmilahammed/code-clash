// import { IChallengeRepository } from "../../../domain/repositories/IChallengeRepository";
// import { IChallenge } from "../../../domain/entities/Challenge";


// export class CreateChallengeUseCase {
//   constructor(
//     private readonly _challengeRepo: IChallengeRepository
//   ) {}

//   async execute(data: {
//     title: string;
//     description: string;
//     difficulty: "easy" | "medium" | "hard";
//     xpReward: number;
//   }): Promise<IChallenge> {
//     return this._challengeRepo.create({
//       ...data,
//       isActive: true,
//     });
//   }
// }





import { IChallengeRepository } from "../../../domain/repositories/IChallengeRepository";
import { IChallenge } from "../../../domain/entities/Challenge";

type CreateChallengeInput = {
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    domain: "javascript" | "python" | "algorithm" | "database" | "network";
    xpReward: number;
    timeLimitMinutes: number;
    isPremium?: boolean;
    starterCode?: string | null;
};

export class CreateChallengeUseCase {
    constructor(
        private readonly _challengeRepo: IChallengeRepository
    ) { }


    async execute(input: CreateChallengeInput): Promise<IChallenge> {
        
        //validation
        if (input.xpReward <= 0) {
            throw new Error("XP_REWARD_INVALID");
        }

        if (input.timeLimitMinutes <= 0) {
            throw new Error("TIME_LIMIT_INVALID");
        }

        if (!input.title.trim()) {
            throw new Error("TITLE_REQUIRED");
        }

        if (!input.description.trim()) {
            throw new Error("DESCRIPTION_REQUIRED");
        }



        const challenge: IChallenge = {
            title: input.title,
            description: input.description,
            difficulty: input.difficulty,
            domain: input.domain,
            xpReward: input.xpReward,
            timeLimitMinutes: input.timeLimitMinutes,

            starterCode: input.starterCode ?? null,

            isPremium: input.isPremium ?? false,
            isActive: true,
        };

        return this._challengeRepo.create(challenge);
    }
}
