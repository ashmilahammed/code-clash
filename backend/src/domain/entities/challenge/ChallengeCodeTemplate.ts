// export interface IChallengeCodeTemplate {
//   id?: string;

//   challengeId: string;
//   // language: "javascript" | "python" | "java" | "c" | "cpp";
//   language : string;

//   starterCode: string;
//   solutionCode: string;
// }




export class ChallengeCodeTemplate {
  constructor(
    public readonly id: string | undefined,
    public readonly challengeId: string,
    public readonly language: string,
    public starterCode: string,
    public solutionCode: string
  ) {
    this.validate();
  }

  private validate() {
    if (!this.language) {
      throw new Error("Language is required for code template");
    }

    if (!this.starterCode) {
      throw new Error("Starter code cannot be empty");
    }

    if (!this.solutionCode) {
      throw new Error("Solution code cannot be empty");
    }
  }
}

