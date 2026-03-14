import api from "./axiosInstance";

export interface Conversation {
    id: string;
    type: 'direct' | 'group';
    participants: string[];
    adminId?: string;
    name?: string;
    description?: string;
    memberLimit?: number;
    isPrivate?: boolean;
    lastMessageAt?: Date;
    updatedAt: Date;
    participantDetails?: { id: string; username: string; avatar?: string }[];
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    isDeleted: boolean;
    messageType: 'text' | 'image';
    mediaUrl: string | null;
    readBy: string[];
    createdAt: Date;
    sender?: {
        _id: string;
        username: string;
        profilePic?: string;
    };
}

export const chatApi = {
    getConversations: async (): Promise<Conversation[]> => {
        const response = await api.get('/chat/conversations');
        return response.data.data;
    },

    getPublicGroups: async (): Promise<Conversation[]> => {
        const response = await api.get('/chat/groups/public');
        return response.data.data;
    },

    getMessages: async (conversationId: string, skip: number = 0, limit: number = 50): Promise<Message[]> => {
        const response = await api.get(`/chat/conversations/${conversationId}/messages?skip=${skip}&limit=${limit}`);
        return response.data.data;
    },

    uploadChatImage: async (conversationId: string, file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post(`/chat/conversations/${conversationId}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    createGroup: async (name: string, description?: string, memberLimit?: number, isPrivate?: boolean, participants: string[] = []): Promise<Conversation> => {
        const response = await api.post('/chat/groups', { name, description, memberLimit, isPrivate, participants });
        return response.data.data;
    },

    joinGroup: async (conversationId: string): Promise<Conversation> => {
        const response = await api.post(`/chat/groups/${conversationId}/join`);
        return response.data.data;
    },

    leaveGroup: async (conversationId: string): Promise<Conversation> => {
        const response = await api.post(`/chat/groups/${conversationId}/leave`);
        return response.data.data;
    },

    inviteToGroup: async (conversationId: string, participants: string[]): Promise<Conversation> => {
        const response = await api.post(`/chat/groups/${conversationId}/invite`, { participants });
        return response.data.data;
    },

    getOrCreateDirectConversation: async (receiverId: string): Promise<Conversation> => {
        const response = await api.post('/chat/conversations/direct', { receiverId });
        return response.data.data;
    }
};
