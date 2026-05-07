import { IUserTransactionDetail } from "../../../domain/repositories/transaction/ITransactionRepository";

export interface IGetCurrentPremiumPlanUseCase {
  execute(userId: string): Promise<IUserTransactionDetail | null>;
}
