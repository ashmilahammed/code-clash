import { IChallenge } from "../../domain/entities/Challenge";
import { IChallengeDoc } from "../../infrastructure/database/models/ChallengeModel";

export class ChallengeMapper {
    static toDomain(doc: IChallengeDoc): IChallenge {
        return {
            id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            difficulty: doc.difficulty,
            domain: doc.domain,
            xpReward: doc.xpReward,
            timeLimitMinutes: doc.timeLimitMinutes,
            isPremium: doc.isPremium,
            isActive: doc.isActive,
            status: doc.status,

            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }


    static toPersistence(
        entity: Partial<IChallenge>
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

        return persistence;
    }
}





//   static toPersistence(
//     entity: Partial<IChallenge>
// ): Partial < IChallengeDoc > {
//     return {
//         title: entity.title,
//         description: entity.description,
//         difficulty: entity.difficulty,
//         domain: entity.domain,
//         xpReward: entity.xpReward,
//         timeLimitMinutes: entity.timeLimitMinutes,
//         isPremium: entity.isPremium ?? false,
//         isActive: entity.isActive ?? true,
//         status: entity.status ?? "draft",
//     };
// }