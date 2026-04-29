import { IReportRepository } from "../../../../domain/repositories/chat/IReportRepository";
import { IDismissReportUseCase } from "../../../interfaces/chat/admin/IDismissReportUseCase";

export class DismissReportUseCase implements IDismissReportUseCase {
    constructor(
        private readonly _reportRepository: IReportRepository
    ) {}

    async execute(reportId: string): Promise<void> {
        const report = await this._reportRepository.findById(reportId);
        if (!report) {
            throw new Error("Report not found");
        }

        await this._reportRepository.updateStatus(reportId, 'dismissed');
    }
}
