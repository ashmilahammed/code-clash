import axios from "axios";
import { ICodeExecutionService } from "../../../domain/services/ICodeExecutionService";


export class PistonExecutionService implements ICodeExecutionService {
  private readonly endpoint = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston/execute";

  async execute(language: string, code: string, input: string) {
    try {
      console.log(`Executing Piston request to: ${this.endpoint} for lang: ${language}`);

      const response = await axios.post(this.endpoint, {
        language: language.toLowerCase(),
        version: "*",
        files: [
          {
            content: code,
          },
        ],
        stdin: input,
      });

      const run = response.data.run;

      return {
        stdout: run.stdout ?? "",
        stderr: run.stderr ?? "",
        runtime: run.time ?? 0,
        memory: run.memory ?? 0,
      };
    } catch (error: any) {
      console.error("Piston Execution Error:", error.message);

      if (error.response) {
        console.error("Piston Res Status:", error.response.status);
        console.error("Piston Res Data:", JSON.stringify(error.response.data));

        if (error.response.status === 401) {
          // Return a user-friendly error
          return {
            stdout: "",
            stderr: "Error: Piston API Unauthorized (401). usage limit reached or API key required. Please configure a self-hosted Piston instance.",
            runtime: 0,
            memory: 0
          };
        }
      }

      return {
        stdout: "",
        stderr: error.message || "Execution Failed",
        runtime: 0,
        memory: 0,
      };
    }
  }
}
