import { Router } from "express";
import { transactionController } from "../../infrastructure/di/transaction.di";
// auth middleware to be added if needed, matching plan.routes
// import { authMiddleware } from "../../infrastructure/di/auth.di";
// import { requireAdminRole } from "../../infrastructure/di/role.di";

const router = Router();

// Routes
router.get("/", transactionController.getTransactions.bind(transactionController));

export default router;
