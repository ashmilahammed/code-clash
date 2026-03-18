import { Request, Response } from "express";

import { GetAdminGroupsUseCase } from "../../application/use-cases/chat/admin/GetAdminGroupsUseCase";
import { UpdateGroupStatusUseCase } from "../../application/use-cases/chat/admin/UpdateGroupStatusUseCase";
import { DeleteGroupUseCase } from "../../application/use-cases/chat/admin/DeleteGroupUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";

import { AdminGroupQueryDTO } from "../../application/dto/chat/AdminGroupQueryDTO";



export class AdminChatController {
    constructor(
        private readonly _getAdminGroupsUseCase: GetAdminGroupsUseCase,
        private readonly _updateGroupStatusUseCase: UpdateGroupStatusUseCase,
        private readonly _deleteGroupUseCase: DeleteGroupUseCase
    ) { }



    getAdminGroups = async (req: Request, res: Response) => {
        try {
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 8);

            if (page < 1 || limit < 1 || limit > 100) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            const dto: AdminGroupQueryDTO = {
                page,
                limit,
            };

            if (typeof req.query.search === "string") {
                dto.search = req.query.search;
            }

            const result = await this._getAdminGroupsUseCase.execute(dto);

            return res.status(HttpStatus.OK).json(
                ApiResponse.success(MESSAGES.CHAT.GROUPS_FETCH_SUCCESS, {
                    data: result.data,
                    total: result.total,
                    page,
                    limit,
                    totalPages: Math.ceil(result.total / limit),
                })
            );

        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };



    updateGroupStatus = async (req: Request, res: Response) => {
        try {
            const groupId = req.params.id;
            const { status } = req.body;

            if (!groupId) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            if (status !== "active" && status !== "inactive") {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            const updatedGroup = await this._updateGroupStatusUseCase.execute(groupId, status);

            return res.status(HttpStatus.OK).json(
                ApiResponse.success(
                    MESSAGES.CHAT.GROUP_STATUS_UPDATED,
                    updatedGroup
                )
            );

        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };



    deleteGroup = async (req: Request, res: Response) => {
        try {
            const groupId = req.params.id;

            if (!groupId) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            await this._deleteGroupUseCase.execute(groupId);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.CHAT.GROUP_DELETED));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };
}