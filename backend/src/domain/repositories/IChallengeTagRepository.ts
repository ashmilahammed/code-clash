export interface IChallengeTagRepository {
  findOrCreate(name: string): Promise<string>; // returns tagId
}



// import { IChallengeTag } from "../entities/ChallengeTag";

// export interface IChallengeTagRepository {
//   findOrCreate(name: string): Promise<IChallengeTag>;
// }
