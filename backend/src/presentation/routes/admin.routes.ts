import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.Middleware";
import { requireRole } from "../middlewares/role.Middleware";


const router = Router();


router.get("/users", authMiddleware, requireRole("admin"), (req, res) => {
    res.json({ message: "Admin: list of all users" });
}
);

export default router;
