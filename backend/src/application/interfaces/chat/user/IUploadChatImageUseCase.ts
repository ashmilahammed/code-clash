export interface IUploadChatImageUseCase {
  execute(file: Buffer, conversationId: string): Promise<string>;
}
