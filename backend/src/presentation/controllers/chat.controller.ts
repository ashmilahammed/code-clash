import { Request, Response } from "express";

import { CreateGroupUseCase } from "../../application/use-cases/chat/user/CreateGroupUseCase";
import { JoinGroupUseCase } from "../../application/use-cases/chat/user/JoinGroupUseCase";
import { GetConversationsUseCase } from "../../application/use-cases/chat/user/GetConversationsUseCase";
import { GetMessagesUseCase } from "../../application/use-cases/chat/user/GetMessagesUseCase";
import { GetOrCreateDirectConversationUseCase } from "../../application/use-cases/chat/user/GetOrCreateDirectConversationUseCase";
import { GetPublicConversationsUseCase } from "../../application/use-cases/chat/user/GetPublicConversationsUseCase";
import { LeaveGroupUseCase } from "../../application/use-cases/chat/user/LeaveGroupUseCase";
import { AddParticipantsUseCase } from "../../application/use-cases/chat/user/AddParticipantsUseCase";
import { UploadChatImageUseCase } from "../../application/use-cases/chat/user/UploadChatImageUseCase";

import { CreateGroupDTO } from "../../application/dto/chat/CreateGroupDTO";
import { AddParticipantsDTO } from "../../application/dto/chat/AddParticipantsDTO";
import { GetMessagesQueryDTO } from "../../application/dto/chat/GetMessagesQueryDTO";
import { DirectConversationDTO } from "../../application/dto/chat/DirectConversationDTO";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";




export class ChatController {
    constructor(
        private readonly _createGroupUseCase: CreateGroupUseCase,
        private readonly _joinGroupUseCase: JoinGroupUseCase,
        private readonly _getConversationsUseCase: GetConversationsUseCase,
        private readonly _getMessagesUseCase: GetMessagesUseCase,
        private readonly _getOrCreateDirectConversationUseCase: GetOrCreateDirectConversationUseCase,
        private readonly _getPublicConversationsUseCase: GetPublicConversationsUseCase,
        private readonly _leaveGroupUseCase: LeaveGroupUseCase,
        private readonly _addParticipantsUseCase: AddParticipantsUseCase,
        private readonly _uploadChatImageUseCase: UploadChatImageUseCase
    ) { }



    createGroup = async (req: Request, res: Response) => {
        try {
            const userId = res.locals.user?.userId;

            if (!userId) {
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
            }

            const { name, description, memberLimit, isPrivate, participants } =
                req.body;

            if (!name) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            const dto: CreateGroupDTO = {
                adminId: userId,
                name,
                description,
                memberLimit,
                isPrivate,
                participants: participants || [],
            };

            const group = await this._createGroupUseCase.execute(dto);

            return res
                .status(HttpStatus.CREATED)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, group));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };



    getPublicGroups = async (req: Request, res: Response) => {
        try {
            const groups = await this._getPublicConversationsUseCase.execute();

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, groups));
        } catch (error: any) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(error.message));
        }
    };



    joinGroup = async (req: Request, res: Response) => {
        try {

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

            const group = await this._joinGroupUseCase.execute(conversationId, userId);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, group));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };



    getConversations = async (req: Request, res: Response) => {
        try {

            const userId = res.locals.user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const conversations = await this._getConversationsUseCase.execute(userId);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, conversations));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };



    getMessages = async (req: Request, res: Response) => {
        try {
            const userId = res.locals.user?.userId;
            const { conversationId } = req.params;

            const limit = Number(req.query.limit ?? 50);
            const skip = Number(req.query.skip ?? 0);

            if (!userId || !conversationId) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            if (limit < 1 || limit > 100) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error("Invalid pagination limit"));
            }

            const dto: GetMessagesQueryDTO = {
                userId,
                conversationId,
                limit,
                skip,
            };

            const messages = await this._getMessagesUseCase.execute(dto);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, messages));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };



    getOrCreateDirectConversation = async (req: Request, res: Response) => {
        try {
            const senderId = res.locals.user?.userId;
            const { receiverId } = req.body;

            if (!senderId || !receiverId) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            const dto: DirectConversationDTO = { senderId, receiverId };

            const conversation = await this._getOrCreateDirectConversationUseCase.execute(dto);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, conversation));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };



    leaveGroup = async (req: Request, res: Response) => {
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

            const group = await this._leaveGroupUseCase.execute(conversationId, userId);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, group));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };



    addParticipants = async (req: Request, res: Response) => {
        try {
            const adderId = res.locals.user?.userId;
            const { conversationId } = req.params;
            const { participants } = req.body;

            if (!adderId || !conversationId || !Array.isArray(participants)) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            const dto: AddParticipantsDTO = {
                adderId,
                conversationId,
                participants,
            };

            const group = await this._addParticipantsUseCase.execute(dto);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, group));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };




    uploadChatImage = async (req: Request, res: Response) => {
        try {

            const conversationId = req.params.conversationId;
            const file = req.file;

            if (!conversationId) {
                res.status(400).json({ message: "Conversation ID is required" });
                return;
            }

            if (!file) {
                res.status(400).json({ message: "Image file is required" });
                return;
            }

            const url = await this._uploadChatImageUseCase.execute(file.buffer, conversationId);


            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, { url }));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };
}