import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";

export class GetCurrentPremiumPlanUseCase {
    constructor(
        private readonly _transactionRepository: ITransactionRepository
    ) { }

    async execute(userId: string): Promise<any> {
        return this._transactionRepository.findLatestSuccessfulTransaction(userId);
    }
}
