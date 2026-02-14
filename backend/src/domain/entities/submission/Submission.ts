export type SubmissionStatus =
  | "PASSED"
  | "FAILED"
  | "ERROR";

export class Submission {
  constructor(
    public readonly id: string | undefined,
    public readonly userId: string,
    public readonly challengeId: string,
    public language: string,
    public code: string,
    public finalStatus: SubmissionStatus,
    public runtime: number,
    public memory: number,
    public xpEarned: number,
    public readonly submittedAt?: Date
  ) {
    this.validate();
  }

  private validate() {
    if (!this.userId) throw new Error("User required");
    if (!this.challengeId) throw new Error("Challenge required");
    if (!this.language) throw new Error("Language required");
    if (!this.code || this.code.trim().length === 0)
      throw new Error("Code cannot be empty");
  }

  isPassed(): boolean {
    return this.finalStatus === "PASSED";
  }
}












// export type SubmissionStatus =
//   | "PENDING"
//   | "RUNNING"
//   | "PASSED"
//   | "FAILED"
//   | "ERROR";

// export class Submission {
//   constructor(
//     public readonly id: string | undefined,
//     public readonly userId: string,
//     public readonly challengeId: string,
//     public language: string,
//     public code: string,
//     public status: SubmissionStatus,
//     public executionTime?: number,
//     public memoryUsed?: number,
//     public readonly createdAt?: Date
//   ) {
//     this.validate();
//   }

//   private validate() {
//     if (!this.code || this.code.trim().length === 0) {
//       throw new Error("Submission code cannot be empty");
//     }

//     if (!this.language) {
//       throw new Error("Language is required");
//     }
//   }

//   markRunning() {
//     this.status = "RUNNING";
//   }

//   markPassed(time?: number) {
//     this.status = "PASSED";
//     this.executionTime = time;
//   }

//   markFailed(time?: number) {
//     this.status = "FAILED";
//     this.executionTime = time;
//   }

//   markError() {
//     this.status = "ERROR";
//   }
// }

