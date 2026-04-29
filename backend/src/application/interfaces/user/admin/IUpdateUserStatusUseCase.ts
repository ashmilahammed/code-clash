export interface IUpdateUserStatusUseCase {
  execute(
    adminRole: "admin" | "user",
    userId: string,
    status: "active" | "blocked"
  ): Promise<void>;
}
