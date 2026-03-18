import { Request, Response } from "express";
import { CreatePlanUseCase } from "../../application/use-cases/plans/admin/CreatePlanUseCase";
import { GetPlansUseCase } from "../../application/use-cases/plans/admin/GetPlansUseCase";
import { UpdatePlanUseCase } from "../../application/use-cases/plans/admin/UpdatePlanUseCase";
import { DeletePlanUseCase } from "../../application/use-cases/plans/admin/DeletePlanUseCase";

import { CreatePlanDTO } from "../../application/dto/plan/CreatePlanDTO";
import { UpdatePlanDTO } from "../../application/dto/plan/UpdatePlanDTO";

import { ApiResponse } from "../common/ApiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { MESSAGES } from "../constants/messages";



export class PlanController {
    constructor(
        private readonly _createPlanUseCase: CreatePlanUseCase,
        private readonly _getPlansUseCase: GetPlansUseCase,
        private readonly _updatePlanUseCase: UpdatePlanUseCase,
        private readonly _deletePlanUseCase: DeletePlanUseCase
    ) { }


    createPlan = async (req: Request, res: Response) => {
        try {
            const { name, description, price, duration, features, status } = req.body;

            if (!name || price === undefined || duration === undefined) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.COMMON.BAD_REQUEST));
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

            return res
                .status(HttpStatus.CREATED)
                .json(ApiResponse.success(MESSAGES.PLAN.CREATED, plan));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };


    getPlans = async (req: Request, res: Response) => {
        try {
            const plans = await this._getPlansUseCase.execute();

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.PLAN.FETCH_SUCCESS, plans));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };



    getPublicPlans = async (req: Request, res: Response) => {
        try {
            const plans = await this._getPlansUseCase.execute();

            const activePlans = plans.filter(
                (plan) => plan.status === "Active"
            );

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.PLAN.FETCH_SUCCESS, activePlans));

        } catch (err: unknown) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.INTERNAL_ERROR));
        }
    };


    updatePlan = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.PLAN.ID_REQUIRED));
            }

            const dto: UpdatePlanDTO = req.body;

            const updated = await this._updatePlanUseCase.execute(id, dto);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.PLAN.UPDATED, updated));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };


    deletePlan = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(ApiResponse.error(MESSAGES.PLAN.ID_REQUIRED));
            }

            await this._deletePlanUseCase.execute(id);

            return res
                .status(HttpStatus.OK)
                .json(ApiResponse.success(MESSAGES.PLAN.DELETED));
        } catch (err: unknown) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(ApiResponse.error(err instanceof Error ? err.message : MESSAGES.COMMON.BAD_REQUEST));
        }
    };
}