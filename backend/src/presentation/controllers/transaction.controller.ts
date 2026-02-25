import { Request, Response } from "express";
import { GetTransactionsUseCase } from "../../application/use-cases/admin/transactions/GetTransactionsUseCase";
// Assume generic logger exists or try to fetch it from DI
import { WinstonLogger } from "../../infrastructure/services/logger";

export class TransactionController {
    constructor(
        private getTransactionsUseCase: GetTransactionsUseCase,
        private logger: WinstonLogger
    ) { }

    async getTransactions(req: Request, res: Response) {
        try {
            const transactions = await this.getTransactionsUseCase.execute();
            return res.status(200).json(transactions);
        } catch (error: any) {
            this.logger.error("Error fetching transactions", error);
            return res.status(500).json({ message: "Failed to fetch transactions" });
        }
    }
}
