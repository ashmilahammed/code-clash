// export interface IProgrammingLanguage {
//   id?: string;
//   key: string;        // "javascript"
//   name: string;       // "JavaScript"
//   version: string;    // "18.15.0"
//   isActive: boolean;
// }



export class ProgrammingLanguage {
  constructor(
    public readonly id: string | undefined,
    public key: string,
    public name: string,
    public version: string,
    public isActive: boolean
  ) {
    this.validate();
  }

  private validate() {
    if (!this.key || this.key.trim().length === 0) {
      throw new Error("Programming language key is required");
    }

    if (!this.name || this.name.trim().length === 0) {
      throw new Error("Programming language name is required");
    }

    if (!this.version || this.version.trim().length === 0) {
      throw new Error("Programming language version is required");
    }
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }
}
