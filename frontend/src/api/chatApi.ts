import api from "./axiosInstance";

export interface Conversation {
    id: string;
    type: 'direct' | 'group';
    participants: string[];
    adminId?: string;
    name?: string;
    lastMessageAt?: Date;
    updatedAt: Date;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    readBy: string[];
    createdAt: Date;
}

export const chatApi = {
    getConversations: async (): Promise<Conversation[]> => {
        const response = await api.get('/chat/conversations');
        return response.data;
    },

    getMessages: async (conversationId: string, skip: number = 0, limit: number = 50): Promise<Message[]> => {
        const response = await api.get(`/chat/conversations/${conversationId}/messages?skip=${skip}&limit=${limit}`);
        return response.data;
    },

    createGroup: async (name: string, participants: string[] = []): Promise<Conversation> => {
        const response = await api.post('/chat/groups', { name, participants });
        return response.data;
    },

    joinGroup: async (conversationId: string): Promise<Conversation> => {
        const response = await api.post(`/chat/groups/${conversationId}/join`);
        return response.data;
    },

    getOrCreateDirectConversation: async (receiverId: string): Promise<Conversation> => {
        const response = await api.post('/chat/conversations/direct', { receiverId });
        return response.data;
    }
};
