import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";

export class GetTransactionsUseCase {
    constructor(
        private readonly _transactionRepository: ITransactionRepository) { }

    async execute(): Promise<any[]> {
        return this._transactionRepository.findAllWithDetails();
    }
}
