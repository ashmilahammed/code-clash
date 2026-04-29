export interface IAddChallengeTestCasesUseCase {
  execute(
    challengeId: string,
    cases: {
      input: string;
      expectedOutput: string;
      isSample?: boolean;
    }[]
  ): Promise<void>;
}
