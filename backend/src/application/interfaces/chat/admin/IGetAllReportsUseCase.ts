import { Report } from "../../../../domain/entities/chat/Report";

export interface IGetAllReportsUseCase {
  execute(page: number, limit: number, status?: string): Promise<{ data: Report[]; total: number }>;
}
