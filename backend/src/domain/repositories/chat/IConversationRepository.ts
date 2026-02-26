import { Conversation } from "../../entities/chat/Conversation";

export interface IConversationRepository {
    findById(id: string): Promise<Conversation | null>;
    findByParticipants(participants: string[]): Promise<Conversation | null>;
    findUserConversations(userId: string): Promise<Conversation[]>;
    findPublicGroups(): Promise<Conversation[]>;
    create(conversation: Conversation): Promise<Conversation>;
    update(id: string, data: Partial<Conversation>): Promise<Conversation | null>;
    updateLastMessage(id: string, timestamp: Date): Promise<void>;

    // Admin
    findAdminGroups(page: number, limit: number, search?: string): Promise<{ data: any[], total: number }>;
    delete(id: string): Promise<void>;
}
