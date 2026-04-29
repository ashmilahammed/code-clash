import { VerifyOtpDTO } from "../../dto/auth/VerifyOtpDTO";

export interface IVerifyOtpUseCase {
  execute(dto: VerifyOtpDTO): Promise<void>;
}
