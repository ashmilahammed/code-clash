export class Notification {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly message: string,
    public readonly recipientType: "all" | "normal" | "premium" | "individual",
    public readonly senderId: string,
    public readonly createdAt: Date,
    public readonly recipientId?: string
  ) {}
}
