export class ResetPasswordDTO {
  constructor(
    public readonly userId: string,
    public readonly newPassword: string
  ) {}
}