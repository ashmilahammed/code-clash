import axios from "axios";
import { ICodeExecutionService } from "../../../domain/services/ICodeExecutionService";


export class PistonExecutionService implements ICodeExecutionService {
  private readonly endpoint = "https://emkc.org/api/v2/piston/execute";

  
  async execute(language: string, code: string, input: string) {
    try {
      const response = await axios.post(this.endpoint, {
        language,
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
      return {
        stdout: "",
        stderr: error.message,
        runtime: 0,
        memory: 0,
      };
    }
  }
}
