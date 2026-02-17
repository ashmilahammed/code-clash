export interface IFileStorageService {
  uploadAvatar(
    file: Buffer,
    userId: string
  ): Promise<{ url: string; publicId: string }>;

  deleteFile(publicId: string): Promise<void>;
}
