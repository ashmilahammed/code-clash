import { Router } from "express";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { requireAdmin } from "../../infrastructure/di/user.di";
import { reportController } from "../../infrastructure/di/report.di";

const router = Router();

router.use(authMiddleware);

// User reporting
router.post("/", reportController.reportMessage.bind(reportController));

// Admin management
router.get("/all", requireAdmin, reportController.getAllReports.bind(reportController));
router.post("/ban", requireAdmin, reportController.banUser.bind(reportController));
router.post("/dismiss/:reportId", requireAdmin, reportController.dismissReport.bind(reportController));
router.get("/message/:messageId", requireAdmin, reportController.getReportedMessage.bind(reportController));

export default router;
