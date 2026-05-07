import { IUserTransactionDetail } from "../../../domain/repositories/transaction/ITransactionRepository";

export interface IGetUserTransactionsUseCase {
  execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ data: IUserTransactionDetail[]; total: number }>;
}
