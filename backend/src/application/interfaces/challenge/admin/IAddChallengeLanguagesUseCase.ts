export interface IAddChallengeLanguagesUseCase {
  execute(challengeId: string, keys: string[]): Promise<void>;
}
