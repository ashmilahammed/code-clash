import { TransactionController } from "../../presentation/controllers/transaction.controller";
import { TransactionRepository } from "../repositories/transaction/TransactionRepository";
import { GetTransactionsUseCase } from "../../application/use-cases/transaction/GetTransactionsUseCase";
import { CreateRazorpayOrderUseCase } from "../../application/use-cases/transaction/CreateRazorpayOrderUseCase";
import { VerifyRazorpayPaymentUseCase } from "../../application/use-cases/transaction/VerifyRazorpayPaymentUseCase";
import { RazorpayService } from "../services/razorpay/RazorpayService";
import { PlanRepository } from "../repositories/plan/PlanRepository";
import { UserRepository } from "../repositories/user/UserRepository";
import { WinstonLogger } from "../services/logger";

// Shared services
const logger = new WinstonLogger();
const razorpayService = new RazorpayService();

// Repositories
const transactionRepository = new TransactionRepository();
const planRepository = new PlanRepository();
const userRepository = new UserRepository();

// Use Cases
const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);
const createRazorpayOrderUseCase = new CreateRazorpayOrderUseCase(planRepository, razorpayService);
const verifyRazorpayPaymentUseCase = new VerifyRazorpayPaymentUseCase(
    transactionRepository,
    userRepository,
    planRepository,
    razorpayService
);

// Controller
export const transactionController = new TransactionController(
    getTransactionsUseCase,
    createRazorpayOrderUseCase,
    verifyRazorpayPaymentUseCase,
    logger
);
