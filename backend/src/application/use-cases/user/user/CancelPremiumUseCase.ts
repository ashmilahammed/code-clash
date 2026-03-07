import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";

export class CancelPremiumUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.is_premium = false;
        user.premium_expiry_date = null;

        await this.userRepository.save(user);
    }
}
