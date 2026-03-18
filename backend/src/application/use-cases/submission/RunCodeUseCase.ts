import { ICodeExecutionService } from "../../../domain/services/ICodeExecutionService";


export class RunCodeUseCase {
  constructor(
    private readonly _executionService: ICodeExecutionService
  ) { }

  async execute(language: string, code: string, input: string) {
    if (!code || code.trim().length === 0) {
      throw new Error("Code cannot be empty");
    }

    if (!language) {
      throw new Error("Language is required");
    }

    return this._executionService.execute(language, code, input);
  }
}
