import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";

export class GetTransactionsUseCase {
    constructor(private transactionRepository: ITransactionRepository) { }

    async execute(): Promise<any[]> {
        return this.transactionRepository.findAllWithDetails();
    }
}
