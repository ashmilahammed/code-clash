export interface BanUserFromReportDTO {
  userId: string;
  days: number;
  reason: string;
  reportId: string;
}