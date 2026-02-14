import { Challenge } from "../../entities/challenge/Challenge";
import { PaginatedResult } from "../../types/PaginatedResult";
import { ChallengeListQuery } from "../../types/ChallengeListQuery";


export interface IChallengeRepository {

    findByIdForUser(id: string): Promise<Challenge | null>;

    //admin
    create(data: Challenge): Promise<Challenge>;

    findAll(
        query: ChallengeListQuery
    ): Promise<PaginatedResult<Challenge>>;

    update(
        challengeId: string,
        data: Partial<Challenge>
    ): Promise<Challenge>;

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














// import { IChallenge } from "../../entities/challenge/Challenge";
// import { PaginatedResult } from "../../types/PaginatedResult";
// import { ChallengeListQuery } from "../../types/ChallengeListQuery";


// export interface IChallengeRepository {

//     findByIdForUser(id: string): Promise<IChallenge | null>;

//     //admin
//     create(data: IChallenge): Promise<IChallenge>;

//     findAll(
//         query: ChallengeListQuery
//     ): Promise<PaginatedResult<IChallenge>>;

//     update(
//         challengeId: string,
//         data: Partial<IChallenge>
//     ): Promise<IChallenge>;

//     toggleActive(
//         challengeId: string,
//         isActive: boolean
//     ): Promise<void>;

//     addTags(challengeId: string, tagIds: string[]): Promise<void>;

//     addLanguages(challengeId: string, languageIds: string[]): Promise<void>;


//     updateSchedule(
//         challengeId: string,
//         schedule: {
//             availableFrom?: Date | null;
//             availableUntil?: Date | null;
//         }
//     ): Promise<void>;


//     findByIdWithLanguages(
//         challengeId: string
//     ): Promise<{
//         id: string;
//         languages: { key: string }[];
//     } | null>;

// }


