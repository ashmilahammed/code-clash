import { Request, Response } from "express";
import {
    createGroupUseCase,
    joinGroupUseCase,
    getConversationsUseCase,
    getMessagesUseCase,
    getOrCreateDirectConversationUseCase
} from "../../infrastructure/di/chat.di";

export class ChatController {

    async createGroup(req: Request, res: Response): Promise<void> {
        try {
            const { name, participants } = req.body;
            const adminId = res.locals.user?.userId as string; // Assuming you have standard user object attached

            if (!adminId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const group = await createGroupUseCase.execute({
                adminId,
                name,
                participants: participants || []
            });

            res.status(201).json(group);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async joinGroup(req: Request, res: Response): Promise<void> {
        try {
            // const { conversationId } = req.params;
            const conversationId = req.params.conversationId;

            if (!conversationId) {
                res.status(400).json({ message: "Conversation ID is required" });
                return;
            }

            const userId = res.locals.user?.userId as string;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const group = await joinGroupUseCase.execute(conversationId, userId);
            res.status(200).json(group);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getConversations(req: Request, res: Response): Promise<void> {
        try {
            const userId = res.locals.user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const conversations = await getConversationsUseCase.execute(userId);
            res.status(200).json(conversations);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getMessages(req: Request, res: Response): Promise<void> {
        try {
            // const { conversationId } = req.params;

            const conversationId = req.params.conversationId;

            if (!conversationId) {
                res.status(400).json({ message: "Conversation ID is required" });
                return;
            }

            const userId = res.locals.user?.userId;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
            const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const messages = await getMessagesUseCase.execute(conversationId, userId, limit, skip);
            res.status(200).json(messages);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getOrCreateDirectConversation(req: Request, res: Response): Promise<void> {
        try {
            const { receiverId } = req.body;
            const userId = res.locals.user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const conversation = await getOrCreateDirectConversationUseCase.execute(userId, receiverId);
            res.status(200).json(conversation);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
