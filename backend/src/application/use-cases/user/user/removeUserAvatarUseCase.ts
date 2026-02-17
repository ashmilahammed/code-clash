import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { IFileStorageService } from "../../../../domain/services/IFileStorageService";

export class RemoveUserAvatarUseCase {
    constructor(
        private userRepository: IUserRepository,
        private fileStorage: IFileStorageService
    ) { }

    async execute(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new Error("User not found");

        if (user.avatarPublicId) {
            await this.fileStorage.deleteFile(user.avatarPublicId);
        }

        // Reset avatar fields to null
        user.avatar = null;
        user.avatarPublicId = null;

        await this.userRepository.save(user);

        return user;
    }
}
