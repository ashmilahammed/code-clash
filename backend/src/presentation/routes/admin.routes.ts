import { Router } from "express";
import { authMiddleware, } from "../../infrastructure/di/auth.di";
import { requireAdmin,adminController,} from "../../infrastructure/di/user.di";

import { challengeController } from "../../infrastructure/di/challenge.di";
import { levelController } from "../../infrastructure/di/level.di";

const router = Router();

// middleware
router.use(authMiddleware);
router.use(requireAdmin);


// user management
router.get("/users", adminController.listUsers);
router.patch("/users/:userId/status", adminController.updateUserStatus);

// challenge management
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


// levels management
router.post("/levels",levelController.create );


export default router;




