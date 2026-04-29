export interface IGetAdminChallengeCodeTemplatesUseCase {
  execute(challengeId: string): Promise<{
    language: string;
    starterCode: string;
    solutionCode: string;
  }[]>;
}
