import { Challenge } from "../../../../domain/entities/challenge/Challenge";

export interface IGetAdminChallengeByIdUseCase {
  execute(id: string): Promise<Challenge | null>;
}
