import { Router } from "express";
import { transactionController } from "../../infrastructure/di/transaction.di";
// auth middleware to be added if needed, matching plan.routes
// import { authMiddleware } from "../../infrastructure/di/auth.di";
// import { requireAdminRole } from "../../infrastructure/di/role.di";

const router = Router();

// async/auth bounds
import { authMiddleware } from "../../infrastructure/di/auth.di";

router.use(authMiddleware);

// Routes
router.get("/", transactionController.getTransactions.bind(transactionController));
router.post("/create-order", transactionController.createOrder.bind(transactionController));
router.post("/verify-payment", transactionController.verifyPayment.bind(transactionController));

export default router;
