import { ChallengeTag } from "../../entities/challenge/ChallengeTag";

export interface IChallengeTagRepository {
  findOrCreate(name: string): Promise<ChallengeTag>; // returns tagId
}
