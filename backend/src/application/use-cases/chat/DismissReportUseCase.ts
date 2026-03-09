import { IReportRepository } from "../../../domain/repositories/chat/IReportRepository";

export class DismissReportUseCase {
    constructor(private reportRepository: IReportRepository) {}

    async execute(reportId: string): Promise<void> {
        const report = await this.reportRepository.findById(reportId);
        if (!report) {
            throw new Error("Report not found");
        }

        await this.reportRepository.updateStatus(reportId, 'dismissed');
    }
}
