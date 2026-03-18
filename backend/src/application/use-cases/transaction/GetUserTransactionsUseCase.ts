import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";

export class GetUserTransactionsUseCase {
    constructor(
        private readonly _transactionRepository: ITransactionRepository
    ) { }

    async execute(userId: string, page: number, limit: number): Promise<{ data: any[], total: number }> {
        return this._transactionRepository.findUserTransactions(userId, page, limit);
    }
}
