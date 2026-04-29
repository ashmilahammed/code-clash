import { Challenge } from "../../../../domain/entities/challenge/Challenge";
import { CreateChallengeDTO } from "../../../dto/challenge/CreateChallengeDTO";

export interface ICreateChallengeUseCase {
  execute(input: CreateChallengeDTO): Promise<Challenge>;
}
