import { ICodeExecutionService } from "../../../domain/services/ICodeExecutionService";
import { IRunCodeUseCase } from "../../interfaces/submission/IRunCodeUseCase";


export class RunCodeUseCase implements IRunCodeUseCase {
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

    // return this._executionService.execute(language, code, input);
    
    const result = await this._executionService.execute(language, code, input);

    return {
      output: result.stdout,
      error: result.stderr ?? null,
      memory: result.memory,
      time: result.runtime,
    };
  }
}
