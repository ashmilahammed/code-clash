export interface ICodeExecutionService {
  execute(
    language: string,
    code: string,
    input: string
  ): Promise<{
    stdout: string;
    stderr?: string;
    runtime: number;
    memory: number;
  }>;
}
