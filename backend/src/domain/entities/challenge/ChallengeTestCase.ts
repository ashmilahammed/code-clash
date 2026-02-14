


export class ChallengeTestCase {
  constructor(
    public readonly id: string | undefined,
    public readonly challengeId: string,
    public input: string,
    public expectedOutput: string,
    public isSample: boolean  // visible to user?
  ) {
    this.validate();
  }

  private validate() {
    if (!this.input || this.input.trim().length === 0) {
      throw new Error("Test case input cannot be empty");
    }

    if (
      !this.expectedOutput ||
      this.expectedOutput.trim().length === 0
    ) {
      throw new Error("Expected output cannot be empty");
    }
  }
}









// export interface IChallengeTestCase {
//   id?: string;
//   challengeId: string;

//   input: string;
//   expectedOutput: string;

//   isSample: boolean; // visible to user?
// }

