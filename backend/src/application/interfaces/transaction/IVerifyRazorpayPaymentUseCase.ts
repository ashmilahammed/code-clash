import { Transaction } from "../../../domain/entities/transaction/Transaction";
import { VerifyPaymentDTO } from "../../dto/transaction/VerifyPaymentDTO";

export interface IVerifyRazorpayPaymentUseCase {
  execute(dto: VerifyPaymentDTO): Promise<Transaction>;
}
