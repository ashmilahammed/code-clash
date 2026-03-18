import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { IReportRepository } from "../../../../domain/repositories/chat/IReportRepository";
import { BanUserFromReportDTO } from "../../../dto/report/BanUserFromReportDTO";


export class BanUserUseCase {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _reportRepository: IReportRepository
    ) {}

    async execute(dto: BanUserFromReportDTO): Promise<void> {
        const user = await this._userRepository.findById(dto.userId);
        if (!user) {
            throw new Error("User not found");
        }

        const bannedUntil = new Date();
        bannedUntil.setDate(bannedUntil.getDate() + dto.days);

        user.ban(bannedUntil, dto.reason);
        await this._userRepository.save(user);

        if (dto.reportId) {
            await this._reportRepository.updateStatus(dto.reportId, 'resolved');
        }
    }
}
