

import { Router } from "express";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { challengeController } from "../../infrastructure/di/challenge.di";

const router = Router();

// user only
router.get("/", authMiddleware, challengeController.userList);

// languages (read-only)
router.get("/languages", authMiddleware, challengeController.getLanguages);

router.get("/:id", authMiddleware, challengeController.getById);
router.get(
  "/:id/templates",
  authMiddleware,
  challengeController.getTemplates
);




export default router;


















// import { Router } from "express";
// import { authMiddleware } from "../../infrastructure/di/auth.di";
// import { requireAdmin } from "../../infrastructure/di/admin.di";
// import { challengeController } from "../../infrastructure/di/challenge.di";

// const router = Router();

// //user
// router.get("/", authMiddleware, challengeController.userList);

// //admin
// router.post("/admin", authMiddleware, requireAdmin, challengeController.create);

// router.get(
//     "/admin",
//     authMiddleware,
//     requireAdmin,
//     challengeController.adminList
// );

// router.patch(
//     "/:id/toggle/status",
//     authMiddleware,
//     requireAdmin,
//     challengeController.toggle
// );

// router.post(
//     "/admin/:id/tags",
//     authMiddleware,
//     requireAdmin,
//     challengeController.addTags
// );


// router.get(
//     "/languages",
//     authMiddleware,
//     requireAdmin,
//     challengeController.getLanguages
// );

// router.post(
//     "/admin/:id/languages",
//     authMiddleware,
//     requireAdmin,
//     challengeController.addLanguages
// );


// router.post(
//     "/admin/:id/test-cases",
//     authMiddleware,
//     requireAdmin,
//     challengeController.addTestCases
// );



// router.post(
//     "/admin/:id/hints",
//     authMiddleware,
//     requireAdmin,
//     challengeController.addHints
// );

// router.patch(
//     "/admin/:id/schedule",
//     authMiddleware,
//     requireAdmin,
//     challengeController.updateSchedule
// );


// router.post(
//     "/admin/:id/code-templates",
//     authMiddleware,
//     requireAdmin,
//     challengeController.addCodeTemplates
// );




// export default router;





