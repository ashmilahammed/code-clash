import { Request, Response } from "express";
import { ReportMessageUseCase } from "../../application/use-cases/chat/ReportMessageUseCase";
import { GetAllReportsUseCase } from "../../application/use-cases/chat/GetAllReportsUseCase";
import { BanUserUseCase } from "../../application/use-cases/user/BanUserUseCase";
import { DismissReportUseCase } from "../../application/use-cases/chat/DismissReportUseCase";
import { GetMessageByIdUseCase } from "../../application/use-cases/chat/GetMessageByIdUseCase";

export class ReportController {
    constructor(
        private reportMessageUseCase: ReportMessageUseCase,
        private getAllReportsUseCase: GetAllReportsUseCase,
        private banUserUseCase: BanUserUseCase,
        private dismissReportUseCase: DismissReportUseCase,
        private getMessageByIdUseCase: GetMessageByIdUseCase
    ) {}

    async reportMessage(req: Request, res: Response): Promise<void> {
        try {
            const { messageId, reason } = req.body;
            const reportedById = res.locals.user?.userId;

            if (!reportedById) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const report = await this.reportMessageUseCase.execute({
                reportedById,
                messageId,
                reason
            });

            res.status(201).json(report);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllReports(req: Request, res: Response): Promise<void> {
        try {
            const reports = await this.getAllReportsUseCase.execute();
            res.status(200).json(reports);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async banUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId, days, reason, reportId } = req.body;
            await this.banUserUseCase.execute({ userId, days, reason, reportId });
            res.status(200).json({ message: "User banned successfully" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async dismissReport(req: Request, res: Response): Promise<void> {
        try {
            const { reportId } = req.params;
            if (!reportId) {
                res.status(400).json({ message: "Report ID is required" });
                return;
            }
            await this.dismissReportUseCase.execute(reportId);
            res.status(200).json({ message: "Report dismissed successfully" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getReportedMessage(req: Request, res: Response): Promise<void> {
        try {
            const { messageId } = req.params;
            if (!messageId) {
                res.status(400).json({ message: "Message ID is required" });
                return;
            }
            const message = await this.getMessageByIdUseCase.execute(messageId);
            if (!message) {
                res.status(404).json({ message: "Message not found" });
                return;
            }
            res.status(200).json(message);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
