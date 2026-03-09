import { IReportRepository } from "../../../domain/repositories/chat/IReportRepository";
import { Report, ReportReason } from "../../../domain/entities/chat/Report";
import { IMessageRepository } from "../../../domain/repositories/chat/IMessageRepository";

interface ReportMessageDto {
    reportedById: string;
    messageId: string;
    reason: ReportReason;
}

export class ReportMessageUseCase {
    constructor(
        private reportRepository: IReportRepository,
        private messageRepository: IMessageRepository
    ) {}

    async execute(dto: ReportMessageDto): Promise<Report> {
        const message = await this.messageRepository.findById(dto.messageId);
        if (!message) {
            throw new Error("Message not found");
        }

        const report = new Report(
            undefined,
            message.senderId.toString(),
            dto.reportedById,
            dto.messageId,
            message.conversationId,
            dto.reason
        );

        return this.reportRepository.create(report);
    }
}
