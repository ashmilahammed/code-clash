import { Challenge } from "../../../../domain/entities/challenge/Challenge";

export interface IGetChallengeByIdUseCase {
  execute(id: string): Promise<Challenge | null>;
}
