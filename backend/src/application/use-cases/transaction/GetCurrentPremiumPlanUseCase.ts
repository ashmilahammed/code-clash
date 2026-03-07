import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";

export class GetCurrentPremiumPlanUseCase {
    constructor(private transactionRepository: ITransactionRepository) { }

    async execute(userId: string): Promise<any> {
        return this.transactionRepository.findLatestSuccessfulTransaction(userId);
    }
}
