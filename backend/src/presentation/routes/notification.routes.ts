import { Router } from "express";
import { notificationController } from "../../infrastructure/di/notification.di";
// import { requireAdmin } from "../../infrastructure/di/user.di";

const router = Router();

// User routes 
router.get("/", notificationController.getUserNotifications);
router.patch("/:notificationId/read", notificationController.markAsRead);
router.patch("/mark-all-read", notificationController.markAllAsRead);
router.delete("/clear", notificationController.clearNotifications);

// Admin routes
export const adminNotificationRouter = Router();
adminNotificationRouter.post("/", notificationController.sendNotification);
adminNotificationRouter.get("/history",notificationController.getAdminHistory);

export default router;
