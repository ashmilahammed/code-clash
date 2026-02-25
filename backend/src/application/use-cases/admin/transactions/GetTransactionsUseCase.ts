import { ITransactionRepository } from "../../../../domain/repositories/admin/ITransactionRepository";

export class GetTransactionsUseCase {
    constructor(private transactionRepository: ITransactionRepository) { }

    async execute(): Promise<any[]> {
        return this.transactionRepository.findAllWithDetails();
    }
}
