import { IChallenge } from "../entities/Challenge";
import { PaginatedResult } from "../types/PaginatedResult";
import { ChallengeListQuery } from "../types/ChallengeListQuery";


export interface IChallengeRepository {

    findByIdForUser(id: string): Promise<IChallenge | null>;

    //admin
    create(data: IChallenge): Promise<IChallenge>;

    findAll(
        query: ChallengeListQuery
    ): Promise<PaginatedResult<IChallenge>>;

    update(
        challengeId: string,
        data: Partial<IChallenge>
    ): Promise<IChallenge>;

    toggleActive(
        challengeId: string,
        isActive: boolean
    ): Promise<void>;

    addTags(challengeId: string, tagIds: string[]): Promise<void>;

    addLanguages(challengeId: string, languageIds: string[]): Promise<void>;


    updateSchedule(
        challengeId: string,
        schedule: {
            availableFrom?: Date | null;
            availableUntil?: Date | null;
        }
    ): Promise<void>;


    findByIdWithLanguages(
        challengeId: string
    ): Promise<{
        id: string;
        languages: { key: string }[];
    } | null>;

}







// export interface IChallengeRepository {
//     create(data: Partial<IChallenge>): Promise<IChallenge>;

//     // findAll(query: ListQuery): Promise<PaginatedResult<IChallenge>>;
//     findAll(
//         query: ChallengeListQuery
//     ): Promise<PaginatedResult<IChallenge>>;


//     toggleActive(
//         challengeId: string,
//         isActive: boolean
//     ): Promise<void>;
// }
