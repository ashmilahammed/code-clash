import { Challenge } from "../../../../domain/entities/challenge/Challenge";
import { UpdateChallengeDTO } from "../../../dto/challenge/UpdateChallengeDTO";

export interface IUpdateChallengeUseCase {
  execute(dto: UpdateChallengeDTO): Promise<Challenge>;
}
