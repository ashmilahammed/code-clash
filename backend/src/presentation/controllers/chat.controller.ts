import { Request, Response } from "express";
import { CreateGroupUseCase } from "../../application/use-cases/chat/CreateGroupUseCase";
import { JoinGroupUseCase } from "../../application/use-cases/chat/JoinGroupUseCase";
import { GetConversationsUseCase } from "../../application/use-cases/chat/GetConversationsUseCase";
import { GetMessagesUseCase } from "../../application/use-cases/chat/GetMessagesUseCase";
import { GetOrCreateDirectConversationUseCase } from "../../application/use-cases/chat/GetOrCreateDirectConversationUseCase";
import { GetPublicConversationsUseCase } from "../../application/use-cases/chat/GetPublicConversationsUseCase";
import { LeaveGroupUseCase } from "../../application/use-cases/chat/LeaveGroupUseCase";
import { AddParticipantsUseCase } from "../../application/use-cases/chat/AddParticipantsUseCase";

export class ChatController {
    constructor(
        private createGroupUseCase: CreateGroupUseCase,
        private joinGroupUseCase: JoinGroupUseCase,
        private getConversationsUseCase: GetConversationsUseCase,
        private getMessagesUseCase: GetMessagesUseCase,
        private getOrCreateDirectConversationUseCase: GetOrCreateDirectConversationUseCase,
        private getPublicConversationsUseCase: GetPublicConversationsUseCase,
        private leaveGroupUseCase: LeaveGroupUseCase,
        private addParticipantsUseCase: AddParticipantsUseCase
    ) { }

    async createGroup(req: Request, res: Response): Promise<void> {
        try {
            const { name, description, memberLimit, isPrivate, participants } = req.body;
            const adminId = res.locals.user?.userId as string; // Assuming you have standard user object attached

            if (!adminId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const group = await this.createGroupUseCase.execute({
                adminId,
                name,
                description,
                memberLimit,
                isPrivate,
                participants: participants || []
            });

            res.status(201).json(group);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getPublicGroups(req: Request, res: Response): Promise<void> {
        try {
            const groups = await this.getPublicConversationsUseCase.execute();
            res.status(200).json(groups);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
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

            const group = await this.joinGroupUseCase.execute(conversationId, userId);
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

            const conversations = await this.getConversationsUseCase.execute(userId);
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

            const messages = await this.getMessagesUseCase.execute(conversationId, userId, limit, skip);
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

            const conversation = await this.getOrCreateDirectConversationUseCase.execute(userId, receiverId);
            res.status(200).json(conversation);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async leaveGroup(req: Request, res: Response): Promise<void> {
        try {
            const conversationId = req.params.conversationId;
            const userId = res.locals.user?.userId as string;

            if (!conversationId) {
                res.status(400).json({ message: "Conversation ID is required" });
                return;
            }

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const group = await this.leaveGroupUseCase.execute(conversationId, userId);
            res.status(200).json(group);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async addParticipants(req: Request, res: Response): Promise<void> {
        try {
            const conversationId = req.params.conversationId;
            const adderId = res.locals.user?.userId as string;
            const { participants } = req.body;

            if (!conversationId) {
                res.status(400).json({ message: "Conversation ID is required" });
                return;
            }

            if (!adderId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            if (!participants || !Array.isArray(participants)) {
                res.status(400).json({ message: "Participants array is required" });
                return;
            }

            const group = await this.addParticipantsUseCase.execute(conversationId, adderId, participants);
            res.status(200).json(group);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
