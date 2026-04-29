import { CloudinaryStorageService } from "../../../../infrastructure/adapters/fileStorage/CloudinaryStorageService";
import { IUploadChatImageUseCase } from "../../../interfaces/chat/user/IUploadChatImageUseCase";


export class UploadChatImageUseCase implements IUploadChatImageUseCase {
    constructor(
        private readonly _storageService: CloudinaryStorageService) { }

    async execute(file: Buffer, conversationId: string): Promise<string> {
        
        const result = await this._storageService.uploadChatImage(file, conversationId);
        return result.url;
    }
}
