import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IReportRepository } from "../../../domain/repositories/chat/IReportRepository";

interface BanUserDto {
    userId: string;
    days: number;
    reason: string;
    reportId?: string;
}

export class BanUserUseCase {
    constructor(
        private userRepository: IUserRepository,
        private reportRepository: IReportRepository
    ) {}

    async execute(dto: BanUserDto): Promise<void> {
        const user = await this.userRepository.findById(dto.userId);
        if (!user) {
            throw new Error("User not found");
        }

        const bannedUntil = new Date();
        bannedUntil.setDate(bannedUntil.getDate() + dto.days);

        user.ban(bannedUntil, dto.reason);
        await this.userRepository.save(user);

        if (dto.reportId) {
            await this.reportRepository.updateStatus(dto.reportId, 'resolved');
        }
    }
}
