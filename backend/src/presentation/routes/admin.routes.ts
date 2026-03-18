import { Router } from "express";
import { authMiddleware, } from "../../infrastructure/di/auth.di";
import { requireAdmin, adminController, } from "../../infrastructure/di/user.di";

import planRoutes from "./plan.routes";
import transactionRoutes from "./transaction.routes";

import { adminChatController } from "../../infrastructure/di/chat.di";
import { adminNotificationRouter } from "./notification.routes";
import { adminChallengeController } from "../../infrastructure/di/challenge.di";

const router = Router();

// middleware
router.use(authMiddleware);
router.use(requireAdmin);


// dashboard
router.get("/dashboard/stats", adminController.getDashboardStats);

// user management
router.get("/users", adminController.listUsers);
router.patch("/users/:userId/status", adminController.updateUserStatus);


// challenge management
router.post("/challenges", adminChallengeController.create);
router.patch("/challenges/:id", adminChallengeController.update);
router.get("/challenges", adminChallengeController.adminList);
router.get("/challenges/:id", adminChallengeController.getAdminById);
router.patch("/challenges/:id/status", adminChallengeController.toggle);
router.delete("/challenges/:id", adminChallengeController.delete);

//wizard
router.post("/challenges/:id/tags", adminChallengeController.addTags)
router.get("/languages", adminChallengeController.getLanguages);
router.get("/challenges/:id/languages", adminChallengeController.getChallengeLanguages);
router.post("/challenges/:id/languages", adminChallengeController.addLanguages);
router.post("/challenges/:id/test-cases", adminChallengeController.addTestCases);
router.get("/challenges/:id/test-cases", adminChallengeController.getAdminTestCases);
router.post("/challenges/:id/hints", adminChallengeController.addHints);
router.patch("/challenges/:id/schedule", adminChallengeController.updateSchedule);
router.post("/challenges/:id/code-templates", adminChallengeController.addCodeTemplates);
router.get("/challenges/:id/code-templates", adminChallengeController.getAdminTemplates);



// plan management
router.use("/plans", planRoutes);
router.use("/transactions", transactionRoutes);

// group chat management
router.get("/groups", adminChatController.getAdminGroups);
router.patch("/groups/:id/status", adminChatController.updateGroupStatus);
router.delete("/groups/:id", adminChatController.deleteGroup);

// notification management
router.use("/notifications", adminNotificationRouter);

export default router;




