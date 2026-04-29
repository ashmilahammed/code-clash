export interface ISubmitSolutionUseCase {
  execute(params: {
    userId: string;
    challengeId: string;
    language: string;
    code: string;
  }): Promise<{
    status: "PASSED" | "FAILED" | "ERROR";
    runtime: number;
    memory: number;
    xpEarned: number;
    newLevel: string | null;
  }>;
}
