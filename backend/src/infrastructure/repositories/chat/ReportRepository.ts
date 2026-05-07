import { IReportRepository } from "../../../domain/repositories/chat/IReportRepository";
import { Report, ReportReason, ReportStatus, UserBasicInfo } from "../../../domain/entities/chat/Report";
import { IReportDoc, ReportModel } from "../../database/models/chat/ReportModel";

interface PopulatedUser {
    _id: { toString(): string };
    username: string;
}

interface PopulatedReportDoc extends Omit<IReportDoc, 'reportedUserId' | 'reportedById'> {
    reportedUserId: PopulatedUser | string;
    reportedById: PopulatedUser | string;
}

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

        return this.toEntity(doc as unknown as IReportDoc);
    }

    async findAll(): Promise<Report[]> {
        const docs = await ReportModel.find()
            .populate('reportedUserId', 'username')
            .populate('reportedById', 'username')
            .sort({ createdAt: -1 });
        return (docs as unknown as PopulatedReportDoc[]).map(doc => this.toEntity(doc));
    }

    async findPaginated(page: number, limit: number, status?: string): Promise<{ data: Report[], total: number }> {
        const query: Record<string, unknown> = {};
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
            data: (results as unknown as PopulatedReportDoc[]).map(doc => this.toEntity(doc)),
            total
        };
    }

    async findById(id: string): Promise<Report | null> {
        const doc = await ReportModel.findById(id);
        return doc ? this.toEntity(doc as unknown as IReportDoc) : null;
    }

    async updateStatus(id: string, status: ReportStatus): Promise<Report | null> {
        const doc = await ReportModel.findByIdAndUpdate(id, { status }, { new: true });
        return doc ? this.toEntity(doc as unknown as IReportDoc) : null;
    }

    private toEntity(doc: IReportDoc | PopulatedReportDoc): Report {
        const mapUser = (user: PopulatedUser | string | undefined): string | UserBasicInfo => {
            if (!user) return "";
            if (typeof user !== 'string' && (user as PopulatedUser)._id) {
                return { 
                    id: (user as PopulatedUser)._id.toString(), 
                    username: (user as PopulatedUser).username 
                };
            }
            return user.toString();
        };

        return new Report(
            doc._id.toString(),
            mapUser(doc.reportedUserId as PopulatedUser | string),
            mapUser(doc.reportedById as PopulatedUser | string),
            doc.messageId.toString(),
            doc.conversationId.toString(),
            doc.reason as ReportReason,
            doc.status as ReportStatus,
            doc.createdAt,
            doc.updatedAt
        );
    }
}
