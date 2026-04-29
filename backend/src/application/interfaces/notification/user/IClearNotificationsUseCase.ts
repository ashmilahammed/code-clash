export interface IClearNotificationsUseCase {
  execute(userId: string): Promise<void>;
}
