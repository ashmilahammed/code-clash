import { Report } from "../../../../domain/entities/chat/Report";
import { ReportMessageDTO } from "../../../dto/report/ReportMessageDTO";

export interface IReportMessageUseCase {
  execute(dto: ReportMessageDTO): Promise<Report>;
}
