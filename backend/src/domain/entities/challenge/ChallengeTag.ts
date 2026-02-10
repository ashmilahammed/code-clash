// export interface IChallengeTag {
//   id?: string;
//   name: string;
// }




export class ChallengeTag {
  constructor(
    public readonly id: string | undefined,
    public name: string
  ) {
    this.validate();
  }

  private validate() {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Challenge tag name cannot be empty");
    }
  }

  normalize() {
    this.name = this.name.trim().toLowerCase();
  }
}
