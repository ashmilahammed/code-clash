import { ReportReason } from "../../../domain/entities/chat/Report";

export interface ReportMessageDTO {
  reportedById: string;
  messageId: string;
  reason: ReportReason;
}