import { IReportRepository } from "../../../domain/repositories/chat/IReportRepository";
import { Report } from "../../../domain/entities/chat/Report";

export class GetAllReportsUseCase {
    constructor(private reportRepository: IReportRepository) {}

    async execute(): Promise<Report[]> {
        return this.reportRepository.findAll();
    }
}
