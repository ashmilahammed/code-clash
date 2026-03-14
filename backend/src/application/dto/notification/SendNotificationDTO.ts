export interface SendNotificationDTO {
  title: string;
  message: string;
  recipientType: "all" | "normal" | "premium";
  senderId: string;
}