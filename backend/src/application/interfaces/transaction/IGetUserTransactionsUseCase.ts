import { Transaction } from "../../../domain/entities/transaction/Transaction";

export interface IGetUserTransactionsUseCase {
  execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ data: Transaction[]; total: number }>;
}
