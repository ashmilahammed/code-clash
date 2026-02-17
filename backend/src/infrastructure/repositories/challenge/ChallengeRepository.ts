import { BaseRepository } from "../BaseRepository";
import { ChallengeModel, IChallengeDoc } from "../../database/models/challenge/ChallengeModel";
import { IChallengeRepository } from "../../../domain/repositories/challenge/IChallengeRepository";
// import { IChallenge } from "../../../domain/entities/challenge/Challenge";
import { Challenge } from "../../../domain/entities/challenge/Challenge";
import { ChallengeListQuery } from "../../../domain/types/ChallengeListQuery";
import { PaginatedResult } from "../../../domain/types/PaginatedResult";
import { ChallengeMapper } from "../../../application/mappers/ChallengeMapper";



export class ChallengeRepository
    extends BaseRepository<IChallengeDoc>
    implements IChallengeRepository {

    constructor() {
        super(ChallengeModel);
    }

    async create(data: Challenge): Promise<Challenge> {
        const persistence = ChallengeMapper.toPersistence(data);
        const created = await this.createRaw(persistence);
        return ChallengeMapper.toDomain(created);
    }

    async update(
        challengeId: string,
        data: Partial<Challenge>
    ): Promise<Challenge> {
        const persistence = ChallengeMapper.toPersistence(data);
        const updated = await this.updateRaw(challengeId, persistence);
        return ChallengeMapper.toDomain(updated);
    }

    async findAll(
        query: ChallengeListQuery
    ): Promise<PaginatedResult<Challenge>> {
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
            data: docs.map(ChallengeMapper.toDomain),
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



    async addTags(challengeId: string, tagIds: string[]): Promise<void> {
        await this.updateRaw(
            challengeId,
            {
                $set: { tags: tagIds },
            } as any
        );
    }



    async addLanguages(
        challengeId: string,
        languageIds: string[]
    ): Promise<void> {
        await this.updateRaw(
            challengeId,
            {
                $set: { languages: languageIds },
            } as any
        );
    }



    async updateSchedule(
        challengeId: string,
        schedule: {
            availableFrom?: Date | null;
            availableUntil?: Date | null;
        }
    ): Promise<void> {
        await this.updateRaw(challengeId, schedule);
    }



    async findByIdWithLanguages(
        challengeId: string
    ): Promise<{ id: string; languages: { key: string }[] } | null> {
        const doc = await ChallengeModel.findById(challengeId)
            .populate("languages", "key")
            .lean();

        if (!doc) return null;

        return {
            id: doc._id.toString(),
            languages: (doc.languages as any[]).map((l) => ({
                key: l.key,
            })),
        };
    }




    // user
    // async findByIdForUser(id: string) {
    //     return ChallengeModel.findOne({
    //         _id: id,
    //         isActive: true,
    //         status: "active",
    //     })
    //         .populate("tags")
    //         .populate("languages")
    //         .lean();
    // }

    async findByIdForUser(id: string): Promise<Challenge | null> {
        const doc = await ChallengeModel.findOne({
            _id: id,
            isActive: true,
        })
            .populate("tags")
            .populate("languages")
            .lean();

        if (!doc) return null;

        return ChallengeMapper.toDomain(doc);
    }

    // async findByIdForUser(id: string) {
    //     const doc = await ChallengeModel.findOne({
    //         _id: id,
    //         isActive: true,
    //     })
    //         .populate("tags")
    //         .populate("languages")
    //         .lean();

    //     return doc ? ChallengeMapper.toDomain(doc) : null;
    // }



}

















// import { BaseRepository } from "../BaseRepository";
// import { ChallengeModel, IChallengeDoc } from "../../database/models/challenge/ChallengeModel";
// import { IChallengeRepository } from "../../../domain/repositories/challenge/IChallengeRepository";
// import { IChallenge } from "../../../domain/entities/challenge/Challenge";
// import { ChallengeListQuery } from "../../../domain/types/ChallengeListQuery";
// import { PaginatedResult } from "../../../domain/types/PaginatedResult";
// import { ChallengeMapper } from "../../../application/mappers/ChallengeMapper";



// export class ChallengeRepository
//     extends BaseRepository<IChallengeDoc>
//     implements IChallengeRepository {

//     constructor() {
//         super(ChallengeModel);
//     }

//     async create(data: IChallenge): Promise<IChallenge> {
//         const persistence = ChallengeMapper.toPersistence(data);
//         const created = await this.createRaw(persistence);
//         return ChallengeMapper.toDomain(created);
//     }

//     async update(
//         challengeId: string,
//         data: Partial<IChallenge>
//     ): Promise<IChallenge> {
//         const persistence = ChallengeMapper.toPersistence(data);
//         const updated = await this.updateRaw(challengeId, persistence);
//         return ChallengeMapper.toDomain(updated);
//     }

//     async findAll(
//         query: ChallengeListQuery
//     ): Promise<PaginatedResult<IChallenge>> {
//         const {
//             page,
//             limit,
//             search,
//             sortBy = "createdAt",
//             sortOrder = "desc",
//             filters,
//         } = query;

//         const mongoQuery: Record<string, unknown> = {};

//         if (filters?.isActive !== undefined) {
//             mongoQuery.isActive = filters.isActive;
//         }

//         if (search) {
//             mongoQuery.title = { $regex: search, $options: "i" };
//         }

//         const skip = (page - 1) * limit;
//         const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

//         const [docs, total] = await Promise.all([
//             this.findManyRaw(mongoQuery, skip, limit, sort),
//             this.count(mongoQuery),
//         ]);

//         return {
//             data: docs.map(ChallengeMapper.toDomain),
//             page,
//             limit,
//             total,
//             totalPages: Math.ceil(total / limit),
//         };
//     }


//     async toggleActive(
//         challengeId: string,
//         isActive: boolean
//     ): Promise<void> {
//         await this.updateRaw(challengeId, { isActive });
//     }



//     async addTags(challengeId: string, tagIds: string[]): Promise<void> {
//         await this.updateRaw(
//             challengeId,
//             {
//                 $addToSet: {
//                     tags: { $each: tagIds },
//                 },
//             } as any
//         );
//     }



//     async addLanguages(
//         challengeId: string,
//         languageIds: string[]
//     ): Promise<void> {
//         await this.updateRaw(
//             challengeId,
//             {
//                 $set: { languages: languageIds },
//             } as any
//         );
//     }



//     async updateSchedule(
//         challengeId: string,
//         schedule: {
//             availableFrom?: Date | null;
//             availableUntil?: Date | null;
//         }
//     ): Promise<void> {
//         await this.updateRaw(challengeId, schedule);
//     }



//     async findByIdWithLanguages(
//         challengeId: string
//     ): Promise<{ id: string; languages: { key: string }[] } | null> {
//         const doc = await ChallengeModel.findById(challengeId)
//             .populate("languages", "key")
//             .lean();

//         if (!doc) return null;

//         return {
//             id: doc._id.toString(),
//             languages: (doc.languages as any[]).map((l) => ({
//                 key: l.key,
//             })),
//         };
//     }




//     // user
//     // async findByIdForUser(id: string) {
//     //     return ChallengeModel.findOne({
//     //         _id: id,
//     //         isActive: true,
//     //         status: "active",
//     //     })
//     //         .populate("tags")
//     //         .populate("languages")
//     //         .lean();
//     // }

//     async findByIdForUser(id: string): Promise<IChallenge | null> {
//         const doc = await ChallengeModel.findOne({
//             _id: id,
//             isActive: true,
//         })
//             .populate("tags")
//             .populate("languages")
//             .lean();

//         if (!doc) return null;

//         return ChallengeMapper.toDomain(doc);
//     }

//     // async findByIdForUser(id: string) {
//     //     const doc = await ChallengeModel.findOne({
//     //         _id: id,
//     //         isActive: true,
//     //     })
//     //         .populate("tags")
//     //         .populate("languages")
//     //         .lean();

//     //     return doc ? ChallengeMapper.toDomain(doc) : null;
//     // }



// }



