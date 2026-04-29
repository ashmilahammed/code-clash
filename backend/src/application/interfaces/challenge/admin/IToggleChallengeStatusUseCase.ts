import { ToggleChallengeDTO } from "../../../dto/challenge/ToggleChallengeDTO";

export interface IToggleChallengeStatusUseCase {
  execute(dto: ToggleChallengeDTO, senderId?: string): Promise<void>;
}
