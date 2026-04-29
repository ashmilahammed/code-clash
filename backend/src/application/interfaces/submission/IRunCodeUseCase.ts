export interface IRunCodeUseCase {
  execute(
    language: string,
    code: string,
    input: string
  ): Promise<{
    output: string;
    error: string | null;
    memory?: number;
    time?: number;
  }>;
}
