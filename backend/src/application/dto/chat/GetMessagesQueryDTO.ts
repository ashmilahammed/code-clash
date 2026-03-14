export interface GetMessagesQueryDTO {
  conversationId: string;
  userId: string;
  limit: number;
  skip: number;
}