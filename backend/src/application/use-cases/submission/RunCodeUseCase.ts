import { ICodeExecutionService } from "../../../domain/services/ICodeExecutionService";


export class RunCodeUseCase {
  constructor(
    private readonly executionService: ICodeExecutionService
  ) {}

  async execute(language: string, code: string, input: string) {
    if (!code || code.trim().length === 0) {
      throw new Error("Code cannot be empty");
    }

    return this.executionService.execute(language, code, input);
  }
}
