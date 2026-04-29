import { Transaction } from "../../../domain/entities/transaction/Transaction";

export interface IGetCurrentPremiumPlanUseCase {
  execute(userId: string): Promise<Transaction | null>;
}
