import { CloudinaryStorageService } from "../../../../infrastructure/adapters/fileStorage/CloudinaryStorageService";

export class UploadChatImageUseCase {
    constructor(
        private readonly _storageService: CloudinaryStorageService) { }

    async execute(file: Buffer, conversationId: string): Promise<string> {
        
        const result = await this._storageService.uploadChatImage(file, conversationId);
        return result.url;
    }
}
