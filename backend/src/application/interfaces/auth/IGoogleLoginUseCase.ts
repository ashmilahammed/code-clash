import { GoogleLoginDTO } from "../../dto/auth/GoogleLoginDTO";
import { User } from "../../../domain/entities/user/User";

export interface IGoogleLoginUseCase {
  execute(dto: GoogleLoginDTO): Promise<{ user: User; accessToken: string; refreshToken: string }>;
}
