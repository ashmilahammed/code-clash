import { Request, Response } from "express";

import { ICreateGroupUseCase } from "../../application/interfaces/chat/user/ICreateGroupUseCase";
import { IJoinGroupUseCase } from "../../application/interfaces/chat/user/IJoinGroupUseCase";
import { IGetConversationsUseCase } from "../../application/interfaces/chat/user/IGetConversationsUseCase";
import { IGetMessagesUseCase } from "../../application/interfaces/chat/user/IGetMessagesUseCase";
import { IGetOrCreateDirectConversationUseCase } from "../../application/interfaces/chat/user/IGetOrCreateDirectConversationUseCase";
import { IGetPublicConversationsUseCase } from "../../application/interfaces/chat/user/IGetPublicConversationsUseCase";
import { ILeaveGroupUseCase } from "../../application/interfaces/chat/user/ILeaveGroupUseCase";
import { IAddParticipantsUseCase } from "../../application/interfaces/chat/user/IAddParticipantsUseCase";
import { IUploadChatImageUseCase } from "../../application/interfaces/chat/user/IUploadChatImageUseCase";

import { CreateGroupDTO } from "../../application/dto/chat/CreateGroupDTO";
import { AddParticipantsDTO } from "../../application/dto/chat/AddParticipantsDTO";
import { GetMessagesQueryDTO } from "../../application/dto/chat/GetMessagesQueryDTO";
import { DirectConversationDTO } from "../../application/dto/chat/DirectConversationDTO";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";


export class ChatController {
    constructor(
        private readonly _createGroupUseCase: ICreateGroupUseCase,
        private readonly _joinGroupUseCase: IJoinGroupUseCase,
        private readonly _getConversationsUseCase: IGetConversationsUseCase,
        private readonly _getMessagesUseCase: IGetMessagesUseCase,
        private readonly _getOrCreateDirectConversationUseCase: IGetOrCreateDirectConversationUseCase,
        private readonly _getPublicConversationsUseCase: IGetPublicConversationsUseCase,
        private readonly _leaveGroupUseCase: ILeaveGroupUseCase,
        private readonly _addParticipantsUseCase: IAddParticipantsUseCase,
        private readonly _uploadChatImageUseCase: IUploadChatImageUseCase
    ) { }



    createGroup = asyncHandler(async (req: Request, res: Response) => {
        const userId = res.locals.user?.userId;

        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const { name, description, memberLimit, isPrivate, participants } =
            req.body;

        if (!name) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
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

        res
            .status(HttpStatus.CREATED)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, group));
    });



    getPublicGroups = asyncHandler(async (req: Request, res: Response) => {
        const groups = await this._getPublicConversationsUseCase.execute();

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, groups));
    });



    joinGroup = asyncHandler(async (req: Request, res: Response) => {
        const conversationId = req.params.conversationId;

        if (!conversationId) {
            throw new AppError("Conversation ID is required", HttpStatus.BAD_REQUEST);
        }

        const userId = res.locals.user?.userId as string;

        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const group = await this._joinGroupUseCase.execute(conversationId, userId);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, group));
    });



    getConversations = asyncHandler(async (req: Request, res: Response) => {
        const userId = res.locals.user?.userId;

        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const conversations = await this._getConversationsUseCase.execute(userId);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.FETCH_SUCCESS, conversations));
    });



    getMessages = asyncHandler(async (req: Request, res: Response) => {
        const userId = res.locals.user?.userId;
        const { conversationId } = req.params;

        const limit = Number(req.query.limit ?? 50);
        const skip = Number(req.query.skip ?? 0);

        if (!userId || !conversationId) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        if (limit < 1 || limit > 100) {
            throw new AppError("Invalid pagination limit", HttpStatus.BAD_REQUEST);
        }

        const dto: GetMessagesQueryDTO = {
            userId,
            conversationId,
            limit,
            skip,
        };

        const messages = await this._getMessagesUseCase.execute(dto);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, messages));
    });



    getOrCreateDirectConversation = asyncHandler(async (req: Request, res: Response) => {
        const senderId = res.locals.user?.userId;
        const { receiverId } = req.body;

        if (!senderId || !receiverId) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const dto: DirectConversationDTO = { senderId, receiverId };

        const conversation = await this._getOrCreateDirectConversationUseCase.execute(dto);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, conversation));
    });



    leaveGroup = asyncHandler(async (req: Request, res: Response) => {
        const conversationId = req.params.conversationId;
        const userId = res.locals.user?.userId as string;

        if (!conversationId) {
            throw new AppError("Conversation ID is required", HttpStatus.BAD_REQUEST);
        }

        if (!userId) {
            throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const group = await this._leaveGroupUseCase.execute(conversationId, userId);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, group));
    });



    addParticipants = asyncHandler(async (req: Request, res: Response) => {
        const adderId = res.locals.user?.userId;
        const { conversationId } = req.params;
        const { participants } = req.body;

        if (!adderId || !conversationId || !Array.isArray(participants)) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const dto: AddParticipantsDTO = {
            adderId,
            conversationId,
            participants,
        };

        const group = await this._addParticipantsUseCase.execute(dto);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, group));
    });




    uploadChatImage = asyncHandler(async (req: Request, res: Response) => {
        const conversationId = req.params.conversationId;
        const file = req.file;

        if (!conversationId) {
            throw new AppError("Conversation ID is required", HttpStatus.BAD_REQUEST);
        }

        if (!file) {
            throw new AppError("Image file is required", HttpStatus.BAD_REQUEST);
        }

        const url = await this._uploadChatImageUseCase.execute(file.buffer, conversationId);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.COMMON.SUCCESS, { url }));
    });
}