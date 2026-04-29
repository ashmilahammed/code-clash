import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";
import { IGetTransactionsUseCase } from "../../interfaces/transaction/IGetTransactionsUseCase";


export class GetTransactionsUseCase implements IGetTransactionsUseCase {
    constructor(
        private readonly _transactionRepository: ITransactionRepository) { }

    async execute(): Promise<any[]> {
        return this._transactionRepository.findAllWithDetails();
    }
}
