// import { IChallenge } from "../../domain/entities/challenge/Challenge";
// import { IChallengeDoc } from "../../infrastructure/database/models/challenge/ChallengeModel";

// export class ChallengeMapper {
//     static toDomain(doc: IChallengeDoc): IChallenge {
//         return {
//             id: doc._id.toString(),
//             title: doc.title,
//             description: doc.description,
//             difficulty: doc.difficulty,
//             domain: doc.domain,
//             xpReward: doc.xpReward,
//             timeLimitMinutes: doc.timeLimitMinutes,
//             isPremium: doc.isPremium,
//             isActive: doc.isActive,
//             status: doc.status,

//             createdAt: doc.createdAt,
//             updatedAt: doc.updatedAt,
//         };
//     }


//     static toPersistence(
//         entity: Partial<IChallenge>
//     ): Partial<IChallengeDoc> {
//         const persistence: Partial<IChallengeDoc> = {};

//         if (entity.title !== undefined) {
//             persistence.title = entity.title;
//         }

//         if (entity.description !== undefined) {
//             persistence.description = entity.description;
//         }

//         if (entity.difficulty !== undefined) {
//             persistence.difficulty = entity.difficulty;
//         }

//         if (entity.domain !== undefined) {
//             persistence.domain = entity.domain;
//         }

//         if (entity.xpReward !== undefined) {
//             persistence.xpReward = entity.xpReward;
//         }

//         if (entity.timeLimitMinutes !== undefined) {
//             persistence.timeLimitMinutes = entity.timeLimitMinutes;
//         }

//         if (entity.isPremium !== undefined) {
//             persistence.isPremium = entity.isPremium;
//         }

//         if (entity.isActive !== undefined) {
//             persistence.isActive = entity.isActive;
//         }

//         if (entity.status !== undefined) {
//             persistence.status = entity.status;
//         }

//         return persistence;
//     }
// }




import { Challenge } from "../../domain/entities/challenge/Challenge";
import { IChallengeDoc } from "../../infrastructure/database/models/challenge/ChallengeModel";


export class ChallengeMapper {

  static toDomain(doc: IChallengeDoc): Challenge {
    return new Challenge(
      doc._id.toString(),
      doc.title,
      doc.description,
      doc.difficulty,
      doc.domain,
      doc.xpReward,
      doc.timeLimitMinutes,
      doc.isPremium,
      doc.isActive,
      doc.status,
      doc.availableFrom ?? null,
      doc.availableUntil ?? null,
      doc.createdAt,
      doc.updatedAt
    );
  }

  static toPersistence(
    entity: Partial<Challenge>
  ): Partial<IChallengeDoc> {

    const persistence: Partial<IChallengeDoc> = {};

    if (entity.title !== undefined) {
      persistence.title = entity.title;
    }

    if (entity.description !== undefined) {
      persistence.description = entity.description;
    }

    if (entity.difficulty !== undefined) {
      persistence.difficulty = entity.difficulty;
    }

    if (entity.domain !== undefined) {
      persistence.domain = entity.domain;
    }

    if (entity.xpReward !== undefined) {
      persistence.xpReward = entity.xpReward;
    }

    if (entity.timeLimitMinutes !== undefined) {
      persistence.timeLimitMinutes = entity.timeLimitMinutes;
    }

    if (entity.isPremium !== undefined) {
      persistence.isPremium = entity.isPremium;
    }

    if (entity.isActive !== undefined) {
      persistence.isActive = entity.isActive;
    }

    if (entity.status !== undefined) {
      persistence.status = entity.status;
    }

    if (entity.availableFrom !== undefined) {
      persistence.availableFrom = entity.availableFrom;
    }

    if (entity.availableUntil !== undefined) {
      persistence.availableUntil = entity.availableUntil;
    }

    return persistence;
  }
}
