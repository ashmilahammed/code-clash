import { ITransactionRepository } from "../../../domain/repositories/transaction/ITransactionRepository";
import { IGetCurrentPremiumPlanUseCase } from "../../interfaces/transaction/IGetCurrentPremiumPlanUseCase";


export class GetCurrentPremiumPlanUseCase implements IGetCurrentPremiumPlanUseCase {
    constructor(
        private readonly _transactionRepository: ITransactionRepository
    ) { }

    async execute(userId: string): Promise<any> {
        return this._transactionRepository.findLatestSuccessfulTransaction(userId);
    }
}
