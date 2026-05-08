import { Request, Response } from "express";
import { ICreatePlanUseCase } from "../../application/interfaces/plans/admin/ICreatePlanUseCase";
import { IGetPlansUseCase } from "../../application/interfaces/plans/admin/IGetPlansUseCase";
import { IUpdatePlanUseCase } from "../../application/interfaces/plans/admin/IUpdatePlanUseCase";
import { IDeletePlanUseCase } from "../../application/interfaces/plans/admin/IDeletePlanUseCase";

import { CreatePlanDTO } from "../../application/dto/plan/CreatePlanDTO";
import { UpdatePlanDTO } from "../../application/dto/plan/UpdatePlanDTO";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../common/AppError";



export class PlanController {
    constructor(
        private readonly _createPlanUseCase: ICreatePlanUseCase,
        private readonly _getPlansUseCase: IGetPlansUseCase,
        private readonly _updatePlanUseCase: IUpdatePlanUseCase,
        private readonly _deletePlanUseCase: IDeletePlanUseCase
    ) { }


    createPlan = asyncHandler(async (req: Request, res: Response) => {
        const { name, description, price, duration, features, status } = req.body;

        if (!name || price === undefined || duration === undefined) {
            throw new AppError(MESSAGES.COMMON.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const dto: CreatePlanDTO = {
            name,
            description,
            price,
            duration,
            features,
            status,
        };

        const plan = await this._createPlanUseCase.execute(dto);

        res
            .status(HttpStatus.CREATED)
            .json(ApiResponse.success(MESSAGES.PLAN.CREATED, plan));
    });


    getPlans = asyncHandler(async (req: Request, res: Response) => {
        const plans = await this._getPlansUseCase.execute();

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.PLAN.FETCH_SUCCESS, plans));
    });



    getPublicPlans = asyncHandler(async (req: Request, res: Response) => {
        const plans = await this._getPlansUseCase.execute();

        const activePlans = plans.filter(
            (plan) => plan.status === "Active"
        );

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.PLAN.FETCH_SUCCESS, activePlans));
    });


    updatePlan = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.PLAN.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const dto: UpdatePlanDTO = req.body;

        const updated = await this._updatePlanUseCase.execute(id, dto);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.PLAN.UPDATED, updated));
    });


    deletePlan = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new AppError(MESSAGES.PLAN.ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        await this._deletePlanUseCase.execute(id);

        res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(MESSAGES.PLAN.DELETED));
    });
}