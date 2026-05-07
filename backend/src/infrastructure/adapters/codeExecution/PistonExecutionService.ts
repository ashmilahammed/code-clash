import axios from "axios";
import { ICodeExecutionService } from "../../../domain/services/ICodeExecutionService";



export class PistonExecutionService implements ICodeExecutionService {
  private readonly endpoint = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston/execute";

  
  async execute(language: string, code: string, input: string) {
    try {
      if (!language) {
        throw new Error("Language is required");
      }

      const normalizedLanguage = language.toLowerCase();

      const response = await axios.post(
        this.endpoint,
        {
          language: normalizedLanguage,
          version: "*",
          files: [{ content: code }],
          stdin: input,
        },
        {
          timeout: 10000, // 10 seconds safety timeout
        }
      );

      const run = response.data.run;

      // If program crashed or exited abnormally
      if (run.code !== 0) {
        return {
          stdout: run.stdout ?? "",
          stderr: run.stderr || "Runtime Error",
          runtime: run.time ?? 0,
          memory: run.memory ?? 0,
        };
      }

      return {
        stdout: run.stdout ?? "",
        stderr: run.stderr ?? "",
        runtime: run.time ?? 0,
        memory: run.memory ?? 0,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Piston Execution Error:", errorMessage);

      return {
        stdout: "",
        stderr: "Execution Failed",
        runtime: 0,
        memory: 0,
      };
    }
  }
}








