import { Request, Response } from "express";
import { IGetBadgesUseCase } from "../../application/interfaces/badge/IGetBadgesUseCase";
import { ICreateBadgeUseCase } from "../../application/interfaces/badge/ICreateBadgeUseCase";
import { IUpdateBadgeUseCase } from "../../application/interfaces/badge/IUpdateBadgeUseCase";
import { IDeleteBadgeUseCase } from "../../application/interfaces/badge/IDeleteBadgeUseCase";

import { CreateBadgeDTO } from "../../application/dto/badge/CreateBadgeDTO";
import { UpdateBadgeDTO } from "../../application/dto/badge/UpdateBadgeDTO";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";


export class BadgeController {
    constructor(
        private readonly _getBadgesUseCase: IGetBadgesUseCase,
        private readonly _createBadgeUseCase: ICreateBadgeUseCase,
        private readonly _updateBadgeUseCase: IUpdateBadgeUseCase,
        private readonly _deleteBadgeUseCase: IDeleteBadgeUseCase
    ) { }


    getAll = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 9;
            const search = req.query.search as string || "";

            const result = await this._getBadgesUseCase.execute(page, limit, search);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.BADGE.FETCH_SUCCESS, result));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };



    create = async (req: Request, res: Response) => {
        try {
            const {
                name,
                description,
                icon,
                minXpRequired,
                category,
                requirementType,
                requirementValue,
            } = req.body;


            if (
                !name ||
                !icon ||
                minXpRequired === undefined ||
                !category ||
                !requirementType ||
                requirementValue === undefined
            ) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
            }

            // Create DTO object
            const dto: CreateBadgeDTO = {
                name,
                description,
                icon,
                minXpRequired,
                category,
                requirementType,
                requirementValue,
            };

            const badge = await this._createBadgeUseCase.execute(dto);

            return res
                .status(HttpStatus.CREATED)
                .json(ApiResponse.success(MESSAGES.BADGE.CREATE_SUCCESS, badge));

        } catch (error: unknown) {
            let message =
                error instanceof Error
                    ? error.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            if (message.includes("E11000")) {
                message = MESSAGES.BADGE.ALREADY_EXISTS;
            }

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message));
        }
    };



    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.BADGE.ID_REQUIRED));
            }

            const {
                name,
                description,
                icon,
                minXpRequired,
                category,
                requirementType,
                requirementValue,
                isActive,
            } = req.body;

            const dto: UpdateBadgeDTO = {
                name,
                description,
                icon,
                minXpRequired,
                category,
                requirementType,
                requirementValue,
                isActive,
            };

            const updated = await this._updateBadgeUseCase.execute(id, dto);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.BADGE.UPDATE_SUCCESS, updated));

        } catch (error: unknown) {
            let message =
                error instanceof Error
                    ? error.message
                    : MESSAGES.COMMON.INTERNAL_ERROR;

            if (message.includes("E11000")) {
                message = MESSAGES.BADGE.ALREADY_EXISTS;
            }

            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(message));
        }
    };




    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error("Badge id is required"));
            }

            await this._deleteBadgeUseCase.execute(id);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.BADGE.DELETE_SUCCESS));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };



} 