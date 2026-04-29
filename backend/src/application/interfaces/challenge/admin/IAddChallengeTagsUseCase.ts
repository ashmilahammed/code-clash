export interface IAddChallengeTagsUseCase {
  execute(challengeId: string, tags: string[]): Promise<void>;
}
