export interface SendMessageDTO {
    conversationId: string;
    senderId: string;
    content: string;
    messageType?: 'text' | 'image';
    mediaUrl?: string | null;
}