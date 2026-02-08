// import { Router } from "express";
// import { adminController, authMiddleware, requireAdmin } from "../../infrastructure/di/admin.di";

// // import { authMiddleware } from "../middlewares/auth.Middleware";
// // import { requireRole } from "../middlewares/role.Middleware";

// const router = Router();

// //middleware chain
// router.use(authMiddleware);
// router.use(requireAdmin)

// //routes
// router.get("/users", adminController.listUsers);
// router.patch("/users/:userId/status", adminController.updateUserStatus);

// export default router;




import { Router } from "express";
import {
    adminController,
    authMiddleware,
    requireAdmin,
} from "../../infrastructure/di/admin.di";
import { challengeController } from "../../infrastructure/di/challenge.di";

const router = Router();

// middleware
router.use(authMiddleware);
router.use(requireAdmin);

// users
router.get("/users", adminController.listUsers);
router.patch("/users/:userId/status", adminController.updateUserStatus);




// challenges (ADMIN)
router.post("/challenges", challengeController.create);
router.get("/challenges", challengeController.adminList);

router.patch("/challenges/:id/status", challengeController.toggle);

//wizard
router.post("/challenges/:id/tags", challengeController.addTags);
router.post("/challenges/:id/languages", challengeController.addLanguages);
router.post("/challenges/:id/test-cases", challengeController.addTestCases);
router.post("/challenges/:id/hints", challengeController.addHints);
router.patch("/challenges/:id/schedule", challengeController.updateSchedule);
router.get("/challenges/:id/languages", challengeController.getChallengeLanguages);
router.post("/challenges/:id/code-templates", challengeController.addCodeTemplates);


export default router;




