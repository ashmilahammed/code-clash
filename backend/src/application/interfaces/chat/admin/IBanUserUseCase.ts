import { BanUserFromReportDTO } from "../../../dto/report/BanUserFromReportDTO";

export interface IBanUserUseCase {
  execute(dto: BanUserFromReportDTO): Promise<void>;
}
