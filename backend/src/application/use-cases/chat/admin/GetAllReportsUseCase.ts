import { IReportRepository } from "../../../../domain/repositories/chat/IReportRepository";
import { Report } from "../../../../domain/entities/chat/Report";
import { IGetAllReportsUseCase } from "../../../interfaces/chat/admin/IGetAllReportsUseCase";


export class GetAllReportsUseCase implements IGetAllReportsUseCase {
    constructor(
        private readonly _reportRepository: IReportRepository
    ) {}

    async execute(page: number, limit: number, status?: string): Promise<{ data: Report[], total: number }> {
        return this._reportRepository.findPaginated(page, limit, status);
    }
}
