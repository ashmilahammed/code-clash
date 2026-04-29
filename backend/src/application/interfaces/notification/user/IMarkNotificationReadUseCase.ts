export interface IMarkNotificationReadUseCase {
  execute(userId: string, notificationId: string): Promise<void>;
}
