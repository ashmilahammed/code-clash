import { Request, Response } from "express";

import { IGetAdminGroupsUseCase } from "../../application/interfaces/chat/admin/IGetAdminGroupsUseCase";
import { IUpdateGroupStatusUseCase } from "../../application/interfaces/chat/admin/IUpdateGroupStatusUseCase";
import { IDeleteGroupUseCase } from "../../application/interfaces/chat/admin/IDeleteGroupUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

import { AdminGroupQueryDTO } from "../../application/dto/chat/AdminGroupQueryDTO";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";



export class AdminChatController {
    constructor(
        private readonly _getAdminGroupsUseCase: IGetAdminGroupsUseCase,
        private readonly _updateGroupStatusUseCase: IUpdateGroupStatusUseCase,
        private readonly _deleteGroupUseCase: IDeleteGroupUseCase
    ) { }



    getAdminGroups = asyncHandler(async (req: Request, res: Response) => {
        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 8);

        if (page < 1 || limit < 1 || limit > 100) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const dto: AdminGroupQueryDTO = {
            page,
            limit,
        };

        if (typeof req.query.search === "string") {
            dto.search = req.query.search;
        }

        const result = await this._getAdminGroupsUseCase.execute(dto);

        res.status(HttpStatus.OK).json(
            ApiResponse.success(MESSAGES.CHAT.GROUPS_FETCH_SUCCESS, {
                data: result.groups,
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit),
            })
        );
    });



    updateGroupStatus = asyncHandler(async (req: Request, res: Response) => {
        const groupId = req.params.id;
        const { status } = req.body;

        if (!groupId) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        if (status !== "active" && status !== "inactive") {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const updatedGroup = await this._updateGroupStatusUseCase.execute(groupId, status);

        res.status(HttpStatus.OK).json(
            ApiResponse.success(
                MESSAGES.CHAT.GROUP_STATUS_UPDATED,
                updatedGroup
            )
        );
    });



    deleteGroup = asyncHandler(async (req: Request, res: Response) => {
        const groupId = req.params.id;

        if (!groupId) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        await this._deleteGroupUseCase.execute(groupId);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.CHAT.GROUP_DELETED));
    });
}