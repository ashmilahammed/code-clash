import { CloudinaryStorageService } from "../../../infrastructure/adapters/fileStorage/CloudinaryStorageService";

export class UploadChatImageUseCase {
    constructor(private storageService: CloudinaryStorageService) { }

    async execute(file: Buffer, conversationId: string): Promise<string> {
        const result = await this.storageService.uploadChatImage(file, conversationId);
        return result.url;
    }
}
