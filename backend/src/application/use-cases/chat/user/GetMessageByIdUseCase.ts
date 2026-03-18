import { IMessageRepository } from "../../../../domain/repositories/chat/IMessageRepository";
import { Message } from "../../../../domain/entities/chat/Message";

export class GetMessageByIdUseCase {
    constructor(
        private readonly _messageRepository: IMessageRepository
    ) {}

    async execute(messageId: string): Promise<Message | null> {
        return this._messageRepository.findById(messageId);
    }
}
