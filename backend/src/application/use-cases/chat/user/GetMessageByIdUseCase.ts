import { IMessageRepository } from "../../../../domain/repositories/chat/IMessageRepository";
import { Message } from "../../../../domain/entities/chat/Message";

import { IGetMessageByIdUseCase } from "../../../interfaces/chat/user/IGetMessageByIdUseCase";

export class GetMessageByIdUseCase implements IGetMessageByIdUseCase {
    constructor(
        private readonly _messageRepository: IMessageRepository
    ) {}

    async execute(messageId: string): Promise<Message | null> {
        return this._messageRepository.findById(messageId);
    }
}
