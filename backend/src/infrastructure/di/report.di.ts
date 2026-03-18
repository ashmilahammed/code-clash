import { ReportRepository } from "../repositories/chat/ReportRepository";
import { ReportMessageUseCase } from "../../application/use-cases/chat/user/ReportMessageUseCase";
import { GetAllReportsUseCase } from "../../application/use-cases/chat/admin/GetAllReportsUseCase";
import { BanUserUseCase } from "../../application/use-cases/chat/admin/BanUserUseCase";
import { DismissReportUseCase } from "../../application/use-cases/chat/admin/DismissReportUseCase";
import { GetMessageByIdUseCase } from "../../application/use-cases/chat/user/GetMessageByIdUseCase";
import { ReportController } from "../../presentation/controllers/report.controller";
import { messageRepository } from "./chat.di";
import { userRepository } from "./user.di";

export const reportRepository = new ReportRepository();

export const reportMessageUseCase = new ReportMessageUseCase(reportRepository, messageRepository);
export const getAllReportsUseCase = new GetAllReportsUseCase(reportRepository);
export const banUserUseCase = new BanUserUseCase(userRepository, reportRepository);
export const dismissReportUseCase = new DismissReportUseCase(reportRepository);
export const getMessageByIdUseCase = new GetMessageByIdUseCase(messageRepository);

export const reportController = new ReportController(
    reportMessageUseCase,
    getAllReportsUseCase,
    banUserUseCase,
    dismissReportUseCase,
    getMessageByIdUseCase
);
