import { IReportRepository } from "../../../domain/repositories/chat/IReportRepository";
import { Report } from "../../../domain/entities/chat/Report";

export class GetAllReportsUseCase {
    constructor(private reportRepository: IReportRepository) {}

    async execute(page: number, limit: number, status?: string): Promise<{ data: Report[], total: number }> {
        return this.reportRepository.findPaginated(page, limit, status);
    }
}
