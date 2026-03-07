import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";

export class GetUserTransactionsUseCase {
    constructor(private transactionRepository: ITransactionRepository) { }

    async execute(userId: string): Promise<any[]> {
        return this.transactionRepository.findUserTransactions(userId);
    }
}
