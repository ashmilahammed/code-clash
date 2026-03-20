import { IUserCoreRepository } from "../../../../domain/repositories/user/IUserCoreRepository";
import { IFileStorageService } from "../../../../domain/services/IFileStorageService";



export class UpdateUserAvatarUseCase {
  constructor(
    private readonly _userRepository: IUserCoreRepository,
    private readonly _fileStorage: IFileStorageService
  ) {}

  async execute(userId: string, file: Buffer) {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.avatarPublicId) {
      await this._fileStorage.deleteFile(user.avatarPublicId);
    }

    const { url, publicId } =
      await this._fileStorage.uploadAvatar(file, userId);

    user.updateAvatar(url, publicId);

    await this._userRepository.save(user);

    return user;
  }
}
