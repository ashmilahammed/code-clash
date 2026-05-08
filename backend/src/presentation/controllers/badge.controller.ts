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
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";


export class BadgeController {
    constructor(
        private readonly _getBadgesUseCase: IGetBadgesUseCase,
        private readonly _createBadgeUseCase: ICreateBadgeUseCase,
        private readonly _updateBadgeUseCase: IUpdateBadgeUseCase,
        private readonly _deleteBadgeUseCase: IDeleteBadgeUseCase
    ) { }


    getAll = asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 9;
        const search = req.query.search as string || "";

        const result = await this._getBadgesUseCase.execute(page, limit, search);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.BADGE.FETCH_SUCCESS, result));
    });



    create = asyncHandler(async (req: Request, res: Response) => {
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
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const dto: CreateBadgeDTO = {
            name,
            description,
            icon,
            minXpRequired,
            category,
            requirementType,
            requirementValue,
        };

        try {
            const badge = await this._createBadgeUseCase.execute(dto);

            res
                .status(HttpStatus.CREATED)
                .json(ApiResponse.success(MESSAGES.BADGE.CREATE_SUCCESS, badge));
        } catch (error: unknown) {
            if (error instanceof Error && error.message?.includes("E11000")) {
                throw new AppError(MESSAGES.BADGE.ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
            }
            throw error;
        }
    });



    update = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.BADGE.ID_REQUIRED, HttpStatus.BAD_REQUEST);
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

        try {
            const updated = await this._updateBadgeUseCase.execute(id, dto);

            res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.BADGE.UPDATE_SUCCESS, updated));
        } catch (error: unknown) {
            if (error instanceof Error && error.message?.includes("E11000")) {
                throw new AppError(MESSAGES.BADGE.ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
            }
            throw error;
        }
    });




    delete = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Badge id is required", HttpStatus.BAD_REQUEST);
        }

        await this._deleteBadgeUseCase.execute(id);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.BADGE.DELETE_SUCCESS));
    });
}
 