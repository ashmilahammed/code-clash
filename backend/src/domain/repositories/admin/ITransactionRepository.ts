import { Transaction } from "../../../domain/entities/admin/Transaction";

export interface ITransactionRepository {
    create(transaction: Transaction): Promise<Transaction>;
    findAllWithDetails(): Promise<any[]>;
}
