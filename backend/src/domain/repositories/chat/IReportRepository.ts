import { Report } from "../../entities/chat/Report";

export interface IReportRepository {
    create(report: Report): Promise<Report>;
    findAll(): Promise<Report[]>;
    findPaginated(page: number, limit: number, status?: string): Promise<{ data: Report[], total: number }>;
    findById(id: string): Promise<Report | null>;
    updateStatus(id: string, status: 'pending' | 'dismissed' | 'resolved'): Promise<Report | null>;
}
