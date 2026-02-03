// import { Router } from "express";
// import { challengeController } from "../../infrastructure/di/challenge.di";
// import { authMiddleware, requireAdmin } from "../../infrastructure/di/admin.di";


// const router = Router();

// // user
// router.get("/", authMiddleware, challengeController.list);

// // admin
// router.post(
//     "/",
//     authMiddleware,
//     requireAdmin,
//     challengeController.create
// );

// export default router;






import { Router } from "express";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { requireAdmin } from "../../infrastructure/di/admin.di";
import { challengeController } from "../../infrastructure/di/challenge.di";

const router = Router();

//user
router.get("/", authMiddleware, challengeController.userList);

//admin
router.post("/admin", authMiddleware, requireAdmin, challengeController.create);

router.get(
    "/admin",
    authMiddleware,
    requireAdmin,
    challengeController.adminList
);

router.patch(
    "/:id/toggle/status",
    authMiddleware,
    requireAdmin,
    challengeController.toggle
);

export default router;
