import { IMessageRepository } from "../../../../domain/repositories/chat/IMessageRepository";
import { Message } from "../../../../domain/entities/chat/Message";

export class DeleteMessageUseCase {
    constructor(
        private readonly _messageRepository: IMessageRepository
    ) { }

    async execute(messageId: string, userId: string): Promise<Message> {
        const message = await this._messageRepository.findById(messageId);

        if (!message) {
            throw new Error("Message not found");
        }

        if (message.senderId !== userId) {
            throw new Error("Only the sender can delete this message");
        }

        if (message.isDeleted) {
            throw new Error("Message is already deleted");
        }

        message.markAsDeleted();
        return await this._messageRepository.update(message);
    }
}
