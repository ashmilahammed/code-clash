import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { IFileStorageService } from "../../../../domain/services/IFileStorageService";



export class UpdateUserAvatarUseCase {
  constructor(
    private userRepository: IUserRepository,
    private fileStorage: IFileStorageService
  ) {}

  async execute(userId: string, file: Buffer) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.avatarPublicId) {
      await this.fileStorage.deleteFile(user.avatarPublicId);
    }

    const { url, publicId } =
      await this.fileStorage.uploadAvatar(file, userId);

    user.updateAvatar(url, publicId);

    await this.userRepository.save(user);

    return user;
  }
}
