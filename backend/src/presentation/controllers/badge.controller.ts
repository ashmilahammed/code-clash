import { Request, Response } from "express";
import { GetBadgesUseCase } from "../../application/use-cases/badge/GetBadgesUseCase";
import { CreateBadgeUseCase } from "../../application/use-cases/badge/CreateBadgeUseCase";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";


export class BadgeController {
    constructor(
        private readonly _getBadges: GetBadgesUseCase,
        private readonly _createBadge: CreateBadgeUseCase
    ) { }

    getAll = async (req: Request, res: Response) => {
        try {
            const badges = await this._getBadges.execute();
            return res.status(HttpStatus.OK).json(ApiResponse.success("Badges retrieved successfully", badges));
        } catch (error) {
            const message = error instanceof Error ? error.message : MESSAGES.COMMON.INTERNAL_ERROR;
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ApiResponse.error(message));
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const { name, description, icon, minXpRequired } = req.body;
            const badge = await this._createBadge.execute({ name, description, icon, minXpRequired });
            return res.status(HttpStatus.CREATED).json(ApiResponse.success("Badge created successfully", badge));
        } catch (error) {
            const message = error instanceof Error ? error.message : MESSAGES.COMMON.BAD_REQUEST;
            return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(message));
        }
    }
}
