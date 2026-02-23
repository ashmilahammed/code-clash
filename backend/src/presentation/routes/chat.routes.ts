import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { authMiddleware } from "../../infrastructure/di/auth.di";

const router = Router();
const chatController = new ChatController();

router.use(authMiddleware);

router.post("/groups", chatController.createGroup.bind(chatController));
router.post("/groups/:conversationId/join", chatController.joinGroup.bind(chatController));
router.get("/conversations", chatController.getConversations.bind(chatController));
router.post("/conversations/direct", chatController.getOrCreateDirectConversation.bind(chatController));
router.get("/conversations/:conversationId/messages", chatController.getMessages.bind(chatController));

export default router;
