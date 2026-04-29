import { RegisterDTO } from "../../dto/auth/RegisterDTO";

export interface IRegisterUseCase {
  execute(dto: RegisterDTO): Promise<{ userId: string }>;
}
