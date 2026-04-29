import { IUserCoreRepository } from "../../../../domain/repositories/user/IUserCoreRepository";
import { ICancelPremiumUseCase } from "../../../interfaces/user/user/ICancelPremiumUseCase";

export class CancelPremiumUseCase implements ICancelPremiumUseCase {
    constructor(
        private readonly _userRepository: IUserCoreRepository
    ) {}

    async execute(userId: string): Promise<void> {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.is_premium = false;
        user.premium_expiry_date = null;

        await this._userRepository.save(user);
    }
}
