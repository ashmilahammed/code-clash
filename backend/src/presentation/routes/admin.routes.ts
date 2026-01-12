import { Router } from "express";
import { adminController, authMiddleware, requireAdmin } from "../../infrastructure/di/admin.di";

// import { authMiddleware } from "../middlewares/auth.Middleware";
// import { requireRole } from "../middlewares/role.Middleware";

const router = Router();

//middleware chain
router.use(authMiddleware);
router.use(requireAdmin)

//routes
router.get("/users", adminController.listUsers);
router.patch("/users/:userId/status", adminController.updateUserStatus);

export default router;









// import { Router } from "express";
// import {
//     listUsersController,
//     updateUserStatusController
// } from "../controllers/admin.controllers";
// import { authMiddleware } from "../middlewares/auth.Middleware";
// import { requireRole } from "../middlewares/role.Middleware";


// const router = Router();


// // All admin routes are protected
// router.use(authMiddleware);
// router.use(requireRole("admin"));


// //
// router.get("/users", listUsersController);

// router.patch("/users/:userId/status", updateUserStatusController);

// export default router;





// import { Router } from "express";
// import { authMiddleware } from "../middlewares/auth.Middleware";
// import { requireRole } from "../middlewares/role.Middleware";


// const router = Router();


// router.get("/users", authMiddleware, requireRole("admin"), (req, res) => {
//     res.json({ message: "Admin: list of all users" });
// }
// );

// export default router;




