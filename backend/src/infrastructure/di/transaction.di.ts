import { TransactionController } from "../../presentation/controllers/transaction.controller";
import { TransactionRepository } from "../repositories/admin/TransactionRepository";
import { GetTransactionsUseCase } from "../../application/use-cases/admin/transactions/GetTransactionsUseCase";
import { WinstonLogger } from "../services/logger";

// Shared services
const logger = new WinstonLogger();

// Repositories
const transactionRepository = new TransactionRepository();

// Use Cases
const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);

// Controller
export const transactionController = new TransactionController(
    getTransactionsUseCase,
    logger
);
