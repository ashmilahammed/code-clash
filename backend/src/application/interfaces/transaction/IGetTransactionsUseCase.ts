import { IAdminTransactionDetail } from "../../../domain/repositories/transaction/ITransactionRepository";

export interface IGetTransactionsUseCase {
  execute(): Promise<IAdminTransactionDetail[]>;
}
