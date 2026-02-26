import { Message } from "../../entities/chat/Message";

export interface IMessageRepository {
    findById(id: string): Promise<Message | null>;
    findByConversationId(conversationId: string, limit?: number, skip?: number): Promise<Message[]>;
    create(message: Message): Promise<Message>;
    update(message: Message): Promise<Message>;
    markAsRead(messageId: string, userId: string): Promise<void>;
    markConversationAsRead(conversationId: string, userId: string): Promise<void>;
}
