import { Router } from "express";
import { transactionController } from "../../infrastructure/di/transaction.di";

const router = Router();

// async/auth bounds
import { authMiddleware } from "../../infrastructure/di/auth.di";

router.use(authMiddleware);

// Routes
router.get("/", transactionController.getTransactions.bind(transactionController));
router.get("/my-history", transactionController.getMyTransactions.bind(transactionController));
router.get("/current-plan", transactionController.getCurrentPlan.bind(transactionController));
router.post("/create-order", transactionController.createOrder.bind(transactionController));
router.post("/verify-payment", transactionController.verifyPayment.bind(transactionController));

export default router;
