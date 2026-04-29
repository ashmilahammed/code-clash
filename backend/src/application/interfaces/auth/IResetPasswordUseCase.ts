import { ResetPasswordDTO } from "../../dto/auth/ResetPasswordDTO";

export interface IResetPasswordUseCase {
  execute(dto: ResetPasswordDTO): Promise<void>;
}
