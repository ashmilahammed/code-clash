import { IReportRepository } from "../../../../domain/repositories/chat/IReportRepository";
import { Report, ReportReason } from "../../../../domain/entities/chat/Report";
import { IMessageRepository } from "../../../../domain/repositories/chat/IMessageRepository";
import { ReportMessageDTO } from "../../../dto/report/ReportMessageDTO";


export class ReportMessageUseCase {
    constructor(
        private readonly _reportRepository: IReportRepository,
        private readonly _messageRepository: IMessageRepository
    ) {}

    async execute(dto: ReportMessageDTO): Promise<Report> {

        const message = await this._messageRepository.findById(dto.messageId);

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

        return this._reportRepository.create(report);
    }
}
