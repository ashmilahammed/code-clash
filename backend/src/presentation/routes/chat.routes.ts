import { Router } from "express";
import { authMiddleware } from "../../infrastructure/di/auth.di";
import { chatController } from "../../infrastructure/di/chat.di";

const router = Router();

router.use(authMiddleware);

router.post("/groups", chatController.createGroup.bind(chatController));
router.get("/groups/public", chatController.getPublicGroups.bind(chatController));
router.post("/groups/:conversationId/join", chatController.joinGroup.bind(chatController));
router.post("/groups/:conversationId/leave", chatController.leaveGroup.bind(chatController));
router.post("/groups/:conversationId/invite", chatController.addParticipants.bind(chatController));

router.get("/conversations", chatController.getConversations.bind(chatController));
router.post("/conversations/direct", chatController.getOrCreateDirectConversation.bind(chatController));
router.get("/conversations/:conversationId/messages", chatController.getMessages.bind(chatController));

export default router;
