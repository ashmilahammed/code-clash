import { ChangePasswordDTO } from "../../dto/auth/ChangePasswordDTO";

export interface IChangePasswordUseCase {
  execute(dto: ChangePasswordDTO): Promise<void>;
}
