// import { IChallengeRepository } from "../../domain/repositories/IChallengeRepository";
// import { IChallenge } from "../../domain/entities/Challenge";
// import { ChallengeModel, IChallengeDoc } from "../database/models/ChallengeModel";


// export class ChallengeRepository implements IChallengeRepository {

//   private toDomain(doc: IChallengeDoc): IChallenge {
//     return {
//       id: doc._id.toString(),
//       title: doc.title,
//       description: doc.description,
//       difficulty: doc.difficulty,
//       xpReward: doc.xpReward,
//       isActive: doc.isActive,
//       createdAt: doc.createdAt,
//       updatedAt: doc.updatedAt,
//     };
//   }

//   async create(data: Partial<IChallenge>): Promise<IChallenge> {
//     const doc = await ChallengeModel.create(data);
//     return this.toDomain(doc);
//   }

//   async findAll(): Promise<IChallenge[]> {
//     const docs = await ChallengeModel.find({ isActive: true }).exec();
//     return docs.map((d) => this.toDomain(d));
//   }

//   async findById(id: string): Promise<IChallenge | null> {
//     const doc = await ChallengeModel.findById(id).exec();
//     return doc ? this.toDomain(doc) : null;
//   }
// }







import { BaseRepository } from "./BaseRepository";
import { ChallengeModel, IChallengeDoc } from "../database/models/ChallengeModel";
import { IChallengeRepository } from "../../domain/repositories/IChallengeRepository";
import { IChallenge } from "../../domain/entities/Challenge";
import { ChallengeListQuery } from "../../domain/types/ChallengeListQuery";
import { PaginatedResult } from "../../domain/types/PaginatedResult";



export class ChallengeRepository
    extends BaseRepository<IChallengeDoc>
    implements IChallengeRepository {

    constructor() {
        super(ChallengeModel);
    }

    private toDomain(doc: IChallengeDoc): IChallenge {
        return {
            id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            difficulty: doc.difficulty,
            domain: doc.domain,
            xpReward: doc.xpReward,
            timeLimitMinutes: doc.timeLimitMinutes,
            starterCode: doc.starterCode ?? null,
            isPremium: doc.isPremium,
            isActive: doc.isActive,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }

    async create(data: Partial<IChallenge>): Promise<IChallenge> {
        const created = await this.createRaw(data);
        return this.toDomain(created);
    }

    async findAll(query: ChallengeListQuery): Promise<PaginatedResult<IChallenge>> {
        const {
            page,
            limit,
            search,
            sortBy = "createdAt",
            sortOrder = "desc",
            filters,
        } = query;

        const mongoQuery: Record<string, unknown> = {};

        if (filters?.isActive !== undefined) {
            mongoQuery.isActive = filters.isActive;
        }

        if (search) {
            mongoQuery.title = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;
        const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

        const [docs, total] = await Promise.all([
            this.findManyRaw(mongoQuery, skip, limit, sort),
            this.count(mongoQuery),
        ]);

        return {
            data: docs.map((d) => this.toDomain(d)),
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }

    async toggleActive(
        challengeId: string,
        isActive: boolean
    ): Promise<void> {
        await this.updateRaw(challengeId, { isActive });
    }
}
