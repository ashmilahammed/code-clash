import { ITransactionRepository, IUserTransactionDetail } from "../../../domain/repositories/transaction/ITransactionRepository";
import { IGetUserTransactionsUseCase } from "../../interfaces/transaction/IGetUserTransactionsUseCase";


export class GetUserTransactionsUseCase implements IGetUserTransactionsUseCase {
    constructor(
        private readonly _transactionRepository: ITransactionRepository
    ) { }

    async execute(userId: string, page: number, limit: number): Promise<{ data: IUserTransactionDetail[], total: number }> {
        return this._transactionRepository.findUserTransactions(userId, page, limit);
    }
}
