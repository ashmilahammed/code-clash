import { Transaction } from "../../entities/transaction/Transaction";

export interface ITransactionRepository {
    create(transaction: Transaction): Promise<Transaction>;
    findAllWithDetails(): Promise<any[]>;
}
