import { create } from 'zustand';
import type { Conversation, Message } from '../api/chatApi';
import { chatApi } from '../api/chatApi';
import { io, Socket } from 'socket.io-client';

interface ChatState {
    conversations: Conversation[];
    publicGroups: Conversation[];
    activeConversation: Conversation | null;
    messages: Message[];
    socket: Socket | null;
    isLoading: boolean;

    // Actions
    initializeSocket: (token: string) => void;
    disconnectSocket: () => void;
    fetchConversations: () => Promise<void>;
    fetchPublicGroups: () => Promise<void>;
    setActiveConversation: (conversation: Conversation | null) => void;
    fetchMessages: (conversationId: string) => Promise<void>;
    sendMessage: (content: string, messageType?: 'text' | 'image', mediaUrl?: string) => void;
    deleteMessage: (messageId: string) => void;
    receiveMessage: (message: Message) => void;
    createGroup: (name: string, description?: string, memberLimit?: number, isPrivate?: boolean, participants?: string[]) => Promise<void>;
    joinGroup: (conversationId: string) => Promise<void>;
    leaveGroup: (conversationId: string) => Promise<void>;
    inviteToGroup: (conversationId: string, participants: string[]) => Promise<void>;
    startDirectMessage: (receiverId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    publicGroups: [],
    activeConversation: null,
    messages: [],
    socket: null,
    isLoading: false,

    initializeSocket: (token: string) => {
        const currentSocket = get().socket;
        if (currentSocket) return;

        const socket = io('http://localhost:5000', {
            auth: { token },
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('receive_message', (message: Message) => {
            get().receiveMessage(message);
        });

        socket.on('message_deleted', (deletedMessage: Message) => {
            const { activeConversation, messages } = get();
            if (activeConversation && activeConversation.id === deletedMessage.conversationId) {
                const updatedMessages = messages.map(msg =>
                    msg.id === deletedMessage.id ? deletedMessage : msg
                );
                set({ messages: updatedMessages });
            }
        });

        socket.on('conversation_list_updated', () => {
            // Trigger a re-fetch of conversations to get latest sorting/state
            get().fetchConversations();
        });

        set({ socket });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },

    fetchConversations: async () => {
        set({ isLoading: true });
        try {
            const conversations = await chatApi.getConversations();
            set({ conversations, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            set({ isLoading: false });
        }
    },

    setActiveConversation: (conversation) => {
        set({ activeConversation: conversation });
        if (conversation) {
            get().fetchMessages(conversation.id);
            // Join room via socket to ensure we get real-time updates specifically for this active view
            const { socket } = get();
            if (socket) {
                socket.emit('join_conversation', conversation.id);
            }
        } else {
            set({ messages: [] });
        }
    },

    fetchMessages: async (conversationId: string) => {
        try {
            const messages = await chatApi.getMessages(conversationId);
            set({ messages });
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    },

    sendMessage: (content: string, messageType: 'text' | 'image' = 'text', mediaUrl?: string) => {
        const { socket, activeConversation } = get();
        if (!socket || !activeConversation) return;

        socket.emit('send_message', {
            conversationId: activeConversation.id,
            content,
            messageType,
            mediaUrl
        });
    },

    deleteMessage: (messageId: string) => {
        const { socket, activeConversation } = get();
        if (!socket || !activeConversation) return;

        socket.emit('delete_message', {
            messageId,
            conversationId: activeConversation.id
        });
    },

    receiveMessage: (message: Message) => {
        const { activeConversation, messages } = get();

        // Only append to message list if it belongs to currently active conversation
        if (activeConversation && activeConversation.id === message.conversationId) {
            // Check if message already exists to prevent duplicates
            const exists = messages.some(m => m.id === message.id);
            if (!exists) {
                set({ messages: [...messages, message] });
            }
        }
    },

    fetchPublicGroups: async () => {
        try {
            const publicGroups = await chatApi.getPublicGroups();
            set({ publicGroups });
        } catch (error) {
            console.error('Failed to fetch public groups:', error);
        }
    },

    // createGroup: async (name: string, participants: string[] = []) => {
    //     try {
    //         const newGroup = await chatApi.createGroup(name, participants);
    //         set(state => ({ conversations: [newGroup, ...state.conversations] }));
    //         get().setActiveConversation(newGroup);
    //     } catch (error) {
    //         console.error('Failed to create group:', error);
    //         throw error;
    //     }
    // },

    createGroup: async (name: string, description?: string, memberLimit?: number, isPrivate?: boolean, participants: string[] = []) => {
        try {
            const newGroup = await chatApi.createGroup(name, description, memberLimit, isPrivate, participants);
            set(state => ({ conversations: [newGroup, ...state.conversations] }));
            get().setActiveConversation(newGroup);
        } catch (error: any) {
            console.log("STATUS:", error.response?.status);
            console.log("BACKEND MESSAGE:", error.response?.data);
            throw error;
        }
    },

    joinGroup: async (conversationId: string) => {
        try {
            const group = await chatApi.joinGroup(conversationId);
            get().fetchConversations(); // refresh list
            get().setActiveConversation(group);

            const { socket } = get();
            if (socket) {
                socket.emit('join_conversation', conversationId);
            }
        } catch (error) {
            console.error('Failed to join group:', error);
            throw error;
        }
    },

    startDirectMessage: async (receiverId: string) => {
        try {
            const conversation = await chatApi.getOrCreateDirectConversation(receiverId);
            get().fetchConversations();
            get().setActiveConversation(conversation);
        } catch (error) {
            console.error('Failed to start direct message:', error);
            throw error;
        }
    },

    leaveGroup: async (conversationId: string) => {
        try {
            await chatApi.leaveGroup(conversationId);
            get().fetchConversations();
            get().fetchPublicGroups(); // Re-fetch public groups in case it was public

            const { activeConversation } = get();
            if (activeConversation?.id === conversationId) {
                get().setActiveConversation(null);
            }
        } catch (error) {
            console.error('Failed to leave group:', error);
            throw error;
        }
    },

    inviteToGroup: async (conversationId: string, participants: string[]) => {
        try {
            const updatedGroup = await chatApi.inviteToGroup(conversationId, participants);
            get().fetchConversations();

            const { activeConversation } = get();
            if (activeConversation?.id === conversationId) {
                get().setActiveConversation(updatedGroup);
            }
        } catch (error) {
            console.error('Failed to invite to group:', error);
            throw error;
        }
    }
}));
