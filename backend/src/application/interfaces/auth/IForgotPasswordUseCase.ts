import { ForgotPasswordDTO } from "../../dto/auth/ForgotPasswordDTO";

export interface IForgotPasswordUseCase {
  execute(dto: ForgotPasswordDTO): Promise<{ userId: string }>;
}
