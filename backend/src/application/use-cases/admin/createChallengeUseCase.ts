// import { IChallengeRepository } from "../../../domain/repositories/IChallengeRepository";
// import {
//   IChallenge,
//   ChallengeDifficulty,
//   ChallengeDomain,
// } from "../../../domain/entities/Challenge";
// import { CreateChallengeDTO } from "../../dto/challenge/CreateChallengeDTO";



// export class CreateChallengeUseCase {
//   constructor(
//     private readonly challengeRepo: IChallengeRepository
//   ) {}

//   async execute(input: CreateChallengeDTO): Promise<IChallenge> {
    
//     if (!input.title.trim()) {
//       throw new Error("TITLE_REQUIRED");
//     }

//     if (!input.description.trim()) {
//       throw new Error("DESCRIPTION_REQUIRED");
//     }

//     if (input.xpReward <= 0) {
//       throw new Error("XP_REWARD_INVALID");
//     }

//     if (
//       input.timeLimitMinutes !== undefined &&
//       input.timeLimitMinutes <= 0
//     ) {
//       throw new Error("TIME_LIMIT_INVALID");
//     }

//     //  Domain object creation
//     const challenge: IChallenge = {
//       title: input.title,
//       description: input.description,
//       difficulty: input.difficulty as ChallengeDifficulty,
//       domain: input.domain as ChallengeDomain,
//       xpReward: input.xpReward,
//       timeLimitMinutes: input.timeLimitMinutes,

//       isPremium: input.isPremium ?? false,
//       isActive: false,
//       status: "draft",
//     };

//     return this.challengeRepo.create(challenge);
//   }
// }






import { IChallengeRepository } from "../../../domain/repositories/IChallengeRepository";
import {
  IChallenge,
  ChallengeDifficulty,
  ChallengeDomain,
} from "../../../domain/entities/Challenge";
import { CreateChallengeDTO } from "../../dto/challenge/CreateChallengeDTO";

export class CreateChallengeUseCase {
  constructor(
    private readonly challengeRepo: IChallengeRepository
  ) {}

  async execute(input: CreateChallengeDTO): Promise<IChallenge> {
    if (!input.title || !input.title.trim()) {
      throw new Error("TITLE_REQUIRED");
    }

    if (!input.description || !input.description.trim()) {
      throw new Error("DESCRIPTION_REQUIRED");
    }

    if (!input.difficulty) {
      throw new Error("DIFFICULTY_REQUIRED");
    }

    if (!input.domain) {
      throw new Error("DOMAIN_REQUIRED");
    }

    if (typeof input.xpReward !== "number" || input.xpReward <= 0) {
      throw new Error("XP_REWARD_INVALID");
    }

    if (
      input.timeLimitMinutes !== undefined &&
      input.timeLimitMinutes <= 0
    ) {
      throw new Error("TIME_LIMIT_INVALID");
    }

    const challenge: IChallenge = {
      title: input.title.trim(),
      description: input.description.trim(),
      difficulty: input.difficulty as ChallengeDifficulty,
      domain: input.domain as ChallengeDomain,
      xpReward: input.xpReward,
      timeLimitMinutes: input.timeLimitMinutes,
      isPremium: input.isPremium ?? false,
      isActive: false,
      status: "draft",
    };

    return this.challengeRepo.create(challenge);
  }
}








// import { IChallengeRepository } from "../../../domain/repositories/IChallengeRepository";
// import { IChallenge } from "../../../domain/entities/Challenge";


// type CreateChallengeInput = {
//     title: string;
//     description: string;
//     difficulty: "easy" | "medium" | "hard";
//     domain: "javascript" | "python" | "algorithm" | "database" | "network";
//     xpReward: number;
//     timeLimitMinutes: number;
//     isPremium?: boolean;
// };

// export class CreateChallengeUseCase {
//     constructor(
//         private readonly _challengeRepo: IChallengeRepository
//     ) { }



//     async execute(input: CreateChallengeInput): Promise<IChallenge> {
//         return this._challengeRepo.create({
//             title: input.title,
//             description: input.description,
//             difficulty: input.difficulty,
//             domain: input.domain,
//             xpReward: input.xpReward,
//             timeLimitMinutes: input.timeLimitMinutes,
//             isPremium: input.isPremium ?? false,

//             isActive: false,
//             status: "draft",
//         });
//     }

//     // async execute(input: CreateChallengeInput): Promise<IChallenge> {

//     //     //validation
//     //     if (input.xpReward <= 0) {
//     //         throw new Error("XP_REWARD_INVALID");
//     //     }

//     //     if (input.timeLimitMinutes <= 0) {
//     //         throw new Error("TIME_LIMIT_INVALID");
//     //     }

//     //     if (!input.title.trim()) {
//     //         throw new Error("TITLE_REQUIRED");
//     //     }

//     //     if (!input.description.trim()) {
//     //         throw new Error("DESCRIPTION_REQUIRED");
//     //     }



//     //     const challenge: IChallenge = {
//     //         title: input.title,
//     //         description: input.description,
//     //         difficulty: input.difficulty,
//     //         domain: input.domain,
//     //         xpReward: input.xpReward,
//     //         timeLimitMinutes: input.timeLimitMinutes,

//     //         starterCode: input.starterCode ?? null,

//     //         isPremium: input.isPremium ?? false,
//     //         isActive: true,
//     //     };

//     //     return this._challengeRepo.create(challenge);
//     // }
// }
