// import { Submission } from "../../entities/submission/Submission";


// export interface ISubmissionRepository {

//   create(submission: Submission): Promise<Submission>;

//   update(submission: Submission): Promise<Submission>;

//   findByUserAndChallenge(
//     userId: string,
//     challengeId: string
//   ): Promise<Submission[]>;

//   hasUserSolvedChallenge(
//     userId: string,
//     challengeId: string
//   ): Promise<boolean>;
// }



import { Submission } from "../../entities/submission/Submission";

export interface ISubmissionRepository {
  create(submission: Submission): Promise<Submission>;

  findByUserAndChallenge(
    userId: string,
    challengeId: string
  ): Promise<Submission[]>;

  hasUserSolvedChallenge(
    userId: string,
    challengeId: string
  ): Promise<boolean>;
}
