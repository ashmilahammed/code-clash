// import { IChallenge } from "../entities/Challenge";

// export interface IChallengeRepository {
//   create(data: Partial<IChallenge>): Promise<IChallenge>;
//   findAll(): Promise<IChallenge[]>;
//   findById(id: string): Promise<IChallenge | null>;
// }






import { IChallenge } from "../entities/Challenge";
import { PaginatedResult } from "../types/PaginatedResult";
import { ChallengeListQuery } from "../types/ChallengeListQuery";


export interface IChallengeRepository {
    create(data: Partial<IChallenge>): Promise<IChallenge>;

    // findAll(query: ListQuery): Promise<PaginatedResult<IChallenge>>;
    findAll(
        query: ChallengeListQuery
    ): Promise<PaginatedResult<IChallenge>>;


    toggleActive(
        challengeId: string,
        isActive: boolean
    ): Promise<void>;
}
