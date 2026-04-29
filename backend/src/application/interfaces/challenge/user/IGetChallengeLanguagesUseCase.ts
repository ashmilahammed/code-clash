export interface IGetChallengeLanguagesUseCase {
  execute(challengeId: string): Promise<string[]>;
}
