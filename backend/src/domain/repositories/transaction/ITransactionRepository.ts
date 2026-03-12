import { Transaction } from "../../entities/transaction/Transaction";

export interface ITransactionRepository {
    create(transaction: Transaction): Promise<Transaction>;
    findAllWithDetails(): Promise<any[]>;
    findUserTransactions(userId: string, page: number, limit: number): Promise<{ data: any[], total: number }>;
    findLatestSuccessfulTransaction(userId: string): Promise<any>;
}
