import { IReportRepository } from "../../../domain/repositories/chat/IReportRepository";
import { Report, ReportReason, ReportStatus, UserBasicInfo } from "../../../domain/entities/chat/Report";
import { ReportModel } from "../../database/models/chat/ReportModel";


export class ReportRepository implements IReportRepository {

    async create(report: Report): Promise<Report> {
        const getId = (val: string | UserBasicInfo) => typeof val === 'string' ? val : val.id;
        const doc = await ReportModel.create({
            reportedUserId: getId(report.reportedUserId),
            reportedById: getId(report.reportedById),
            messageId: report.messageId,
            conversationId: report.conversationId,
            reason: report.reason,
            status: report.status
        });

        return this.toEntity(doc);
    }

    async findAll(): Promise<Report[]> {
        const docs = await ReportModel.find()
            .populate('reportedUserId', 'username')
            .populate('reportedById', 'username')
            .sort({ createdAt: -1 });
        return docs.map(doc => this.toEntity(doc));
    }

    async findPaginated(page: number, limit: number, status?: string): Promise<{ data: Report[], total: number }> {
        const query: any = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const [results, total] = await Promise.all([
            ReportModel.find(query)
                .populate('reportedUserId', 'username')
                .populate('reportedById', 'username')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ReportModel.countDocuments(query)
        ]);

        return {
            data: results.map(doc => this.toEntity(doc)),
            total
        };
    }

    async findById(id: string): Promise<Report | null> {
        const doc = await ReportModel.findById(id);
        return doc ? this.toEntity(doc) : null;
    }

    async updateStatus(id: string, status: ReportStatus): Promise<Report | null> {
        const doc = await ReportModel.findByIdAndUpdate(id, { status }, { new: true });
        return doc ? this.toEntity(doc) : null;
    }

    private toEntity(doc: any): Report {
        const mapUser = (user: any) => {
            if (!user) return "";
            if (user._id) {
                return { 
                    id: user._id.toString(), 
                    username: user.username 
                };
            }
            return user.toString();
        };

        return new Report(
            doc._id.toString(),
            mapUser(doc.reportedUserId),
            mapUser(doc.reportedById),
            doc.messageId.toString(),
            doc.conversationId.toString(),
            doc.reason as ReportReason,
            doc.status as ReportStatus,
            doc.createdAt,
            doc.updatedAt
        );
    }
}
