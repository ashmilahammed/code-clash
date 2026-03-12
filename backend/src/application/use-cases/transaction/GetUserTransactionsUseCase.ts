import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";

export class GetUserTransactionsUseCase {
    constructor(private transactionRepository: ITransactionRepository) { }

    async execute(userId: string, page: number, limit: number): Promise<{ data: any[], total: number }> {
        return this.transactionRepository.findUserTransactions(userId, page, limit);
    }
}
