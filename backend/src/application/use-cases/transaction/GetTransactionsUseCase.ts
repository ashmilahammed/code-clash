import { ITransactionRepository, IAdminTransactionDetail } from "../../../domain/repositories/transaction/ITransactionRepository";
import { IGetTransactionsUseCase } from "../../interfaces/transaction/IGetTransactionsUseCase";


export class GetTransactionsUseCase implements IGetTransactionsUseCase {
    constructor(
        private readonly _transactionRepository: ITransactionRepository) { }

    async execute(): Promise<IAdminTransactionDetail[]> {
        return this._transactionRepository.findAllWithDetails();
    }
}
