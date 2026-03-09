import { IMessageRepository } from "../../../domain/repositories/chat/IMessageRepository";
import { Message } from "../../../domain/entities/chat/Message";

export class GetMessageByIdUseCase {
    constructor(private messageRepository: IMessageRepository) {}

    async execute(messageId: string): Promise<Message | null> {
        return this.messageRepository.findById(messageId);
    }
}
