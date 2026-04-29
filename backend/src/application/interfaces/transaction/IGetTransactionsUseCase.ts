import { Transaction } from "../../../domain/entities/transaction/Transaction";

export interface IGetTransactionsUseCase {
  execute(): Promise<Transaction[]>;
}
