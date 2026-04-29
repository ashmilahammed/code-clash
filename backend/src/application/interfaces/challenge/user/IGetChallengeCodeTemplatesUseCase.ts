export interface IGetChallengeCodeTemplatesUseCase {
  execute(challengeId: string, userId: string): Promise<{
    language: string;
    starterCode: string;
    solutionCode: string | null;
  }[]>;
}
