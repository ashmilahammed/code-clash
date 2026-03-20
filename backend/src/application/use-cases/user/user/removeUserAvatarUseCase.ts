import { IUserCoreRepository } from "../../../../domain/repositories/user/IUserCoreRepository";
import { IFileStorageService } from "../../../../domain/services/IFileStorageService";

export class RemoveUserAvatarUseCase {
    constructor(
        private readonly _userRepository: IUserCoreRepository,
        private readonly _fileStorage: IFileStorageService
    ) { }

    async execute(userId: string) {
        const user = await this._userRepository.findById(userId);
        if (!user) throw new Error("User not found");

        if (user.avatarPublicId) {
            await this._fileStorage.deleteFile(user.avatarPublicId);
        }

        // Reset avatar fields to null
        user.avatar = null;
        user.avatarPublicId = null;

        await this._userRepository.save(user);

        return user;
    }
}
