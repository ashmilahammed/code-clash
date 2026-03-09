import { Router } from "express";
import { notificationController } from "../../infrastructure/di/notification.di";
import { requireAdmin } from "../../infrastructure/di/user.di";

const router = Router();

// User routes (will be prefixed with /notifications in main or user routes)
router.get("/", notificationController.getUserNotifications);
router.patch("/:notificationId/read", notificationController.markAsRead);
router.patch("/mark-all-read", notificationController.markAllAsRead);
router.delete("/clear", notificationController.clearNotifications);

// Admin routes (will be used in admin.routes.ts)
export const adminNotificationRouter = Router();
adminNotificationRouter.post("/", requireAdmin, notificationController.sendNotification);
adminNotificationRouter.get("/history", requireAdmin, notificationController.getAdminHistory);

export default router;
