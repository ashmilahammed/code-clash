import { LoginDTO } from "../../dto/auth/LoginDTO";
import { User } from "../../../domain/entities/user/User";

export interface ILoginUseCase {
  execute(dto: LoginDTO): Promise<{ user: User; accessToken: string; refreshToken: string }>;
}
